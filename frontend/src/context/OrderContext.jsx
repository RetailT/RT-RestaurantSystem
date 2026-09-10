import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { calculateTotals } from '../utils/format.js';
import { getNextInvoiceNo } from '../services/orderService.js';
import {
  fetchCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  updateCartType,
  updateCartComment
} from '../services/cartService.js';
import { TERMINAL_INFO } from '../config/api.js';
// CHANGED: needed to know whether a cashier is actually logged in yet
import { useAuth } from './AuthContext.jsx';

const OrderContext = createContext(null);

export const ORDER_TYPES = {
  TAKEAWAY: 'TAKEAWAY',
  DINE_IN: 'DINE_IN'
};

const COMMENT_DEBOUNCE_MS = 600;

function mapServerItem(row) {
  return {
    idx: row.idx,
    pCode: row.pCode,
    description: row.name,
    uPrice: row.unitPrice,
    qty: row.qty,
    disPercent: row.discPercent,
    discount: row.discount,
    note: row.note || ''
  };
}

export function OrderProvider({ children }) {
  // CHANGED: added
  const { isAuthenticated } = useAuth();

  const [items, setItems] = useState([]);
  const [orderType, setOrderType] = useState(ORDER_TYPES.TAKEAWAY);
  const [tableNumber, setTableNumber] = useState(null);
  const [invoiceNo, setInvoiceNo] = useState('—');
  const [paidAmount] = useState(0);
  const [orderNote, setOrderNoteState] = useState('');

  const cartContext = { companyCode: TERMINAL_INFO.companyCode, unitNo: TERMINAL_INFO.unitNo };

  const skipNextCommentSync = useRef(false);
  const commentTimerRef = useRef(null);

  const refreshCart = useCallback(async () => {
    try {
      const { items: rows, orderComment } = await fetchCart(cartContext);
      setItems(rows.map(mapServerItem));
      skipNextCommentSync.current = true;
      setOrderNoteState(orderComment || '');
    } catch {
      // leave current state if the cart can't be reached
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // CHANGED: only fetch the cart once a cashier is actually signed in —
  // this used to fire unconditionally on mount, which meant it ran on the
  // login page itself (no token yet) and always got a 401 from the backend.
  useEffect(() => {
    if (!isAuthenticated) return;
    refreshCart();
  }, [isAuthenticated, refreshCart]);

  useEffect(() => {
    if (commentTimerRef.current) clearTimeout(commentTimerRef.current);

    if (skipNextCommentSync.current) {
      skipNextCommentSync.current = false;
      return;
    }
    if (items.length === 0) return;

    commentTimerRef.current = setTimeout(() => {
      updateCartComment({ ...cartContext, comment: orderNote.trim() || null }).catch(() => {});
    }, COMMENT_DEBOUNCE_MS);

    return () => clearTimeout(commentTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNote, items.length]);

  const setOrderNote = useCallback((value) => {
    setOrderNoteState(value);
  }, []);

  const refreshInvoiceNo = useCallback(async () => {
    try {
      const { invoiceNo: nextNo } = await getNextInvoiceNo(TERMINAL_INFO.unitNo);
      setInvoiceNo(nextNo);
    } catch {
      // keep placeholder if the POS isn't reachable yet
    }
  }, []);

  const addItem = useCallback(
    async (product) => {
      const existing = items.find((i) => i.pCode === product.pCode && !i.note);
      try {
        if (existing) {
          await updateCartItem(existing.idx, { qty: existing.qty + 1 });
        } else {
          await addCartItem({
            ...cartContext,
            pCode: product.pCode,
            uPrice: product.price,
            qty: 1,
            disPercent: 0,
            orderType,
            tableNumber
          });
        }
        await refreshCart();
      } catch {
        // swallow — cart stays as last known server state, cashier can retry the tap
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, orderType, tableNumber]
  );

  const updateQty = useCallback(
    async (idx, qty) => {
      try {
        if (qty <= 0) {
          await removeCartItem(idx);
        } else {
          await updateCartItem(idx, { qty });
        }
        await refreshCart();
      } catch {
        // no-op — refreshCart on next mutation will reconcile
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const updateNote = useCallback(
    async (idx, note) => {
      try {
        await updateCartItem(idx, { note });
        await refreshCart();
      } catch {
        // no-op
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const removeItem = useCallback(
    async (idx) => {
      try {
        await removeCartItem(idx);
        await refreshCart();
      } catch {
        // no-op
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const clearOrder = useCallback(() => {
    setItems([]);
    setOrderType(ORDER_TYPES.TAKEAWAY);
    setTableNumber(null);
    setInvoiceNo('—');
    skipNextCommentSync.current = true;
    setOrderNoteState('');
  }, []);

  const chooseOrderType = useCallback(
    async (type) => {
      setOrderType(type);
      const nextTable = type === ORDER_TYPES.TAKEAWAY ? null : tableNumber;
      if (type === ORDER_TYPES.TAKEAWAY) setTableNumber(null);
      if (items.length > 0) {
        try {
          await updateCartType({ ...cartContext, orderType: type, tableNumber: nextTable });
          await refreshCart();
        } catch {
          // no-op
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items.length, tableNumber]
  );

  const chooseTable = useCallback(
    async (num) => {
      setTableNumber(num);
      if (items.length > 0) {
        try {
          await updateCartType({ ...cartContext, orderType: ORDER_TYPES.DINE_IN, tableNumber: num });
          await refreshCart();
        } catch {
          // no-op
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items.length]
  );

  const totals = useMemo(() => calculateTotals(items, paidAmount), [items, paidAmount]);
  const noOfPieces = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  const value = {
    items,
    addItem,
    updateQty,
    updateNote,
    removeItem,
    clearOrder,
    refreshCart,
    orderType,
    chooseOrderType,
    tableNumber,
    setTableNumber: chooseTable,
    invoiceNo,
    refreshInvoiceNo,
    totals,
    noOfPieces,
    orderNote,
    setOrderNote
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within OrderProvider');
  return ctx;
}