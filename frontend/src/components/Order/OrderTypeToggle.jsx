import React from 'react';
import { ORDER_TYPES } from '../../context/OrderContext.jsx';

export default function OrderTypeToggle({ orderType, tableNumber, onChoose, onOpenTableSelector }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => onChoose(ORDER_TYPES.TAKEAWAY)}
        className={`rounded-xl py-2.5 font-display font-semibold text-sm transition border ${
          orderType === ORDER_TYPES.TAKEAWAY
            ? 'bg-rt-orange-500 border-rt-orange-500 text-black shadow-glow'
            : 'bg-white border-rt-border text-rt-muted hover:border-rt-orange-400'
        }`}
      >
        🥡 Takeaway
      </button>
      <button
        onClick={() => {
          onChoose(ORDER_TYPES.DINE_IN);
          onOpenTableSelector();
        }}
        className={`rounded-xl py-2.5 font-display font-semibold text-sm transition border relative ${
          orderType === ORDER_TYPES.DINE_IN
            ? 'bg-rt-orange-500 border-rt-orange-500 text-black shadow-glow'
            : 'bg-white border-rt-border text-rt-muted hover:border-rt-orange-400'
        }`}
      >
        🍽️ Dine In
        {orderType === ORDER_TYPES.DINE_IN && tableNumber && (
          <span className="absolute -top-2 -right-2 bg-white text-rt-orange-600 text-[10px] font-bold rounded-full w-6 h-6 flex items-center justify-center border border-rt-orange-500 shadow-card">
            T{tableNumber}
          </span>
        )}
      </button>
    </div>
  );
}