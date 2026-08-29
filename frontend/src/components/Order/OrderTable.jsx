import React from 'react';
import { formatMoney, calculateLineAmount } from '../../utils/format.js';

export default function OrderTable({ items, onUpdateQty, onRemove }) {
  return (
    <div className="flex-1 min-h-[140px] overflow-y-auto rounded-xl border border-rt-border bg-rt-black/30">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-rt-charcoal text-rt-orange-200/70 uppercase tracking-wide">
          <tr>
            <th className="text-left font-semibold px-3 py-2">Description</th>
            <th className="text-right font-semibold px-2 py-2">U/Price</th>
            <th className="text-center font-semibold px-2 py-2">Qty</th>
            <th className="text-right font-semibold px-3 py-2">Amount</th>
            <th className="w-6" />
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center text-white/30 py-8">
                No items added yet. Tap a product to add it here.
              </td>
            </tr>
          )}
          {items.map((item) => (
            <tr key={item.pCode} className="border-t border-rt-border/60 hover:bg-rt-cardhover/40">
              <td className="px-3 py-2 text-white">
                <div className="font-medium">{item.description}</div>
                <div className="text-[10px] text-white/30">{item.pCode}</div>
              </td>
              <td className="px-2 py-2 text-right text-white/80 font-mono">{formatMoney(item.uPrice)}</td>
              <td className="px-2 py-2">
                <div className="flex items-center justify-center gap-1">
                  <button
                    onClick={() => onUpdateQty(item.pCode, item.qty - 1)}
                    className="w-5 h-5 flex items-center justify-center rounded bg-rt-card border border-rt-border text-white hover:border-rt-orange-500"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-white font-mono">{item.qty}</span>
                  <button
                    onClick={() => onUpdateQty(item.pCode, item.qty + 1)}
                    className="w-5 h-5 flex items-center justify-center rounded bg-rt-card border border-rt-border text-white hover:border-rt-orange-500"
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="px-3 py-2 text-right text-rt-orange-300 font-mono font-semibold">
                {formatMoney(calculateLineAmount(item))}
              </td>
              <td className="pr-2">
                <button
                  onClick={() => onRemove(item.pCode)}
                  className="text-white/30 hover:text-red-400 text-sm"
                  aria-label={`Remove ${item.description}`}
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
