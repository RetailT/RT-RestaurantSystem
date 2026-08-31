import React from 'react';
import { formatMoney, calculateLineAmount } from '../../utils/format.js';

export default function OrderTable({ items, onUpdateQty, onRemove }) {
  return (
    <div className="w-full min-h-[220px] max-h-[320px] overflow-y-auto overflow-x-hidden rounded-xl border border-rt-border bg-rt-surface">
      <table className="w-full table-fixed text-xs">
        <colgroup>
          <col className="w-[34%]" />
          <col className="w-[18%]" />
          <col className="w-[20%]" />
          <col className="w-[22%]" />
          <col className="w-[6%]" />
        </colgroup>
        <thead className="sticky top-0 bg-rt-surfacealt text-rt-orange-600 uppercase tracking-wide">
          <tr>
            <th className="text-left font-semibold px-2 py-2 truncate">Description</th>
            <th className="text-right font-semibold px-1 py-2 truncate">Price</th>
            <th className="text-center font-semibold px-1 py-2 truncate">Qty</th>
            <th className="text-right font-semibold px-2 py-2 truncate">Amt</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center text-rt-muted py-10">
                No items added yet.
                <br />
                Tap a product to add it here.
              </td>
            </tr>
          )}
          {items.map((item) => (
            <tr key={item.pCode} className="border-t border-rt-border hover:bg-rt-surfacealt/60 align-top">
              <td className="px-2 py-2 text-rt-text">
                <div className="font-medium truncate">{item.description}</div>
                <div className="text-[10px] text-rt-muted truncate">{item.pCode}</div>
              </td>
              <td className="px-1 py-2 text-right text-rt-text/80 font-mono truncate">
                {formatMoney(item.uPrice)}
              </td>
              <td className="px-1 py-2">
                <div className="flex items-center justify-center gap-0.5">
                  <button
                    onClick={() => onUpdateQty(item.pCode, item.qty - 1)}
                    className="w-5 h-5 shrink-0 flex items-center justify-center rounded bg-rt-surfacealt border border-rt-border text-rt-text hover:border-rt-orange-500"
                  >
                    −
                  </button>
                  <span className="w-5 text-center text-rt-text font-mono">{item.qty}</span>
                  <button
                    onClick={() => onUpdateQty(item.pCode, item.qty + 1)}
                    className="w-5 h-5 shrink-0 flex items-center justify-center rounded bg-rt-surfacealt border border-rt-border text-rt-text hover:border-rt-orange-500"
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="px-2 py-2 text-right text-rt-orange-600 font-mono font-semibold truncate">
                {formatMoney(calculateLineAmount(item))}
              </td>
              <td className="pr-1 text-center">
                <button
                  onClick={() => onRemove(item.pCode)}
                  className="text-rt-muted hover:text-red-600 text-sm"
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