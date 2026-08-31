import React, { useEffect, useRef, useState } from 'react';
import { useOrder, ORDER_TYPES } from '../../context/OrderContext.jsx';
import OrderInfoHeader from './OrderInfoHeader.jsx';
import OrderTable from './OrderTable.jsx';
import OrderSummary from './OrderSummary.jsx';
import OrderTypeToggle from './OrderTypeToggle.jsx';
import TableSelectorModal from './TableSelectorModal.jsx';
import { submitOrder } from '../../services/orderService.js';
import { TERMINAL_INFO } from '../../config/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import ItemNoteModal from './ItemNoteModal.jsx';

const ORDER_NOTE_MAX_LEN = 250;

export default function OrderPanel() {
  const {
    items,
    updateQty,
    updateNote,
    removeItem,
    clearOrder,
    orderType,
    chooseOrderType,
    tableNumber,
    setTableNumber,
    invoiceNo,
    totals,
    noOfPieces,
    orderNote,
    setOrderNote
  } = useOrder();
  const { cashier } = useAuth();
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [noteItem, setNoteItem] = useState(null);

  // Clear the "order sent" / error feedback as soon as the customer starts
  // building a new order (i.e. an item gets added, so the count goes up).
  // We only react to increases — removing an item or clearOrder() emptying
  // the list to 0 shouldn't wipe the message the cashier is still reading.
  const prevItemCount = useRef(items.length);
  useEffect(() => {
    if (items.length > prevItemCount.current) {
      setFeedback('');
    }
    prevItemCount.current = items.length;
  }, [items.length]);

  const canSubmit =
    items.length > 0 && !(orderType === ORDER_TYPES.DINE_IN && !tableNumber) && !submitting;

  async function handlePlaceOrder() {
    if (!canSubmit) return;
    setSubmitting(true);
    setFeedback('');
    try {
      await submitOrder({
        companyCode: TERMINAL_INFO.companyCode,
        cashierCode: cashier?.cashierCode,
        unitNo: TERMINAL_INFO.unitNo,
        invoiceNo,
        orderType,
        tableNumber: orderType === ORDER_TYPES.DINE_IN ? tableNumber : null,
        items,
        totals,
        orderNote: orderNote.trim() || null
      });
      setFeedback('Order sent to the kitchen.');
      clearOrder();
    } catch (err) {
      setFeedback(err?.response?.data?.message || 'Could not send the order. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <aside className="w-full lg:w-[420px] shrink-0 flex flex-col gap-3 bg-rt-charcoal/70 border border-rt-border rounded-2xl p-4 shadow-panel lg:sticky lg:top-4 lg:h-[calc(100vh-6rem)] overflow-y-auto">
      <OrderTypeToggle
        orderType={orderType}
        tableNumber={tableNumber}
        onChoose={chooseOrderType}
        onOpenTableSelector={() => setTableModalOpen(true)}
      />

      {orderType === ORDER_TYPES.DINE_IN && (
        <button
          onClick={() => setTableModalOpen(true)}
          className="text-xs text-left rounded-lg bg-rt-surfacealt/60 border border-rt-border px-3 py-2 text-rt-orange-700/80 hover:border-rt-orange-400"
        >
          {tableNumber ? `Table ${tableNumber} selected — tap to change` : 'Tap to choose a table'}
        </button>
      )}

      <OrderInfoHeader />

      <OrderTable
        items={items}
        onUpdateQty={updateQty}
        onRemove={removeItem}
        onEditNote={setNoteItem}
      />

      {/* Whole-order special instructions, separate from per-item notes */}
      <div className="bg-rt-surfacealt/50 border border-rt-border rounded-xl px-3 py-2">
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="order-note" className="text-[10px] uppercase tracking-wide font-semibold text-rt-orange-600">
            Special comment for this order
          </label>
          <span className="text-[10px] text-rt-muted">{orderNote.length}/{ORDER_NOTE_MAX_LEN}</span>
        </div>
        <textarea
          id="order-note"
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value.slice(0, ORDER_NOTE_MAX_LEN))}
          placeholder="e.g. call before delivery, pack separately, no plastic bags…"
          rows={2}
          maxLength={ORDER_NOTE_MAX_LEN}
          className="w-full rounded-lg bg-rt-surface border border-rt-border text-rt-text placeholder:text-rt-muted/70 px-3 py-2 text-xs focus:border-rt-orange-500 outline-none resize-none"
        />
      </div>

      <OrderSummary totals={totals} noOfProducts={items.length} noOfPieces={noOfPieces} />

      {feedback && (
        <p className="text-xs text-center text-rt-orange-700 bg-rt-orange-50 border border-rt-orange-200 rounded-lg py-2">
          {feedback}
        </p>
      )}

      <button
        onClick={handlePlaceOrder}
        disabled={!canSubmit}
        className="w-full rounded-xl bg-rt-orange-500 hover:bg-rt-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-black font-display font-bold text-lg py-3 shadow-glow transition"
      >
        {submitting ? 'Sending…' : 'Send Order'}
      </button>

      <TableSelectorModal
        open={tableModalOpen}
        currentTable={tableNumber}
        onSelect={setTableNumber}
        onClose={() => setTableModalOpen(false)}
      />

      <ItemNoteModal
        item={noteItem}
        onSave={updateNote}
        onClose={() => setNoteItem(null)}
      />
    </aside>
  );
}