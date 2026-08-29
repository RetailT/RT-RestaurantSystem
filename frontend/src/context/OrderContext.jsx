import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { calculateTotals } from '../utils/format.js';
import { getNextInvoiceNo } from '../services/orderService.js';
import { TERMINAL_INFO } from '../config/api.js';

const OrderContext = createContext(null);

export const ORDER_TYPES = {
  TAKEAWAY: 'TAKEAWAY',
  DINE_IN: 'DINE_IN'
};

export function OrderProvider({ children }) {
  const [items, setItems] = useState([]);
  const [orderType, setOrderType] = useState(ORDER_TYPES.TAKEAWAY);
  const [tableNumber, setTableNumber] = useState(null);
  const [invoiceNo, setInvoiceNo] = useState('—');
  const [paidAmount] = useState(0);

  const refreshInvoiceNo = useCallback(async () => {
    try {
      const { invoiceNo: nextNo } = await getNextInvoiceNo(TERMINAL_INFO.unitNo);
      setInvoiceNo(nextNo);
    } catch {
      // keep placeholder if the POS isn't reachable yet
    }
  }, []);

  const addItem = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.pCode === product.pCode);
      if (existing) {
        return prev.map((i) => (i.pCode === product.pCode ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...prev,
        {
          pCode: product.pCode,
          description: product.name,
          uPrice: product.price,
          qty: 1,
          disPercent: 0,
          discount: 0
        }
      ];
    });
  }, []);

  const updateQty = useCallback((pCode, qty) => {
    setItems((prev) =>
      prev
        .map((i) => (i.pCode === pCode ? { ...i, qty: Math.max(qty, 0) } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const removeItem = useCallback((pCode) => {
    setItems((prev) => prev.filter((i) => i.pCode !== pCode));
  }, []);

  const clearOrder = useCallback(() => {
    setItems([]);
    setOrderType(ORDER_TYPES.TAKEAWAY);
    setTableNumber(null);
    setInvoiceNo('—');
  }, []);

  const chooseOrderType = useCallback((type) => {
    setOrderType(type);
    if (type === ORDER_TYPES.TAKEAWAY) setTableNumber(null);
  }, []);

  const totals = useMemo(() => calculateTotals(items, paidAmount), [items, paidAmount]);
  const noOfPieces = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  const value = {
    items,
    addItem,
    updateQty,
    removeItem,
    clearOrder,
    orderType,
    chooseOrderType,
    tableNumber,
    setTableNumber,
    invoiceNo,
    refreshInvoiceNo,
    totals,
    noOfPieces
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within OrderProvider');
  return ctx;
}
