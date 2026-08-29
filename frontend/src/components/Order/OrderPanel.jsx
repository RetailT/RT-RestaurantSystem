import React, { useState } from 'react';
import { useOrder, ORDER_TYPES } from '../../context/OrderContext.jsx';
import OrderInfoHeader from './OrderInfoHeader.jsx';
import OrderTable from './OrderTable.jsx';
import OrderSummary from './OrderSummary.jsx';
import OrderTypeToggle from './OrderTypeToggle.jsx';
import TableSelectorModal from './TableSelectorModal.jsx';
import { submitOrder } from '../../services/orderService.js';
import { TERMINAL_INFO } from '../../config/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function OrderPanel() {
  const {
    items,
    updateQty,
    removeItem,
    clearOrder,
    orderType,
    chooseOrderType,
    tableNumber,
    setTableNumber,
    invoiceNo,
    totals,
    noOfPieces
  } = useOrder();
  const { cashier } = useAuth();
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

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
        totals
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
    <aside className="w-full lg:w-[380px] shrink-0 flex flex-col gap-3 bg-white border border-rt-border rounded-2xl p-4 shadow-panel lg:sticky lg:top-4 lg:h-[calc(100vh-6rem)]">
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

      <OrderTable items={items} onUpdateQty={updateQty} onRemove={removeItem} />

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
    </aside>
  );
}