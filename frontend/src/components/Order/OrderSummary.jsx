import React from 'react';
import { formatMoney } from '../../utils/format.js';

export default function OrderSummary({ totals, noOfProducts, noOfPieces }) {
  const rows = [
    ['Total', totals.total, false],
    ['Total Discount', totals.totalDiscount, false],
    ['Net Total', totals.netTotal, true],
    ['Paid Amount', totals.paidAmount, false],
    ['Balance', totals.balance, true]
  ];

  return (
    <div className="bg-rt-surfacealt/50 border border-rt-border rounded-xl px-4 py-3 space-y-1.5">
      <div className="flex justify-between text-xs text-rt-muted pb-1 mb-1 border-b border-rt-border">
        <span>No. of products: {noOfProducts}</span>
        <span>Pieces: {noOfPieces}</span>
      </div>
      {rows.map(([label, value, highlight]) => (
        <div key={label} className="flex items-center justify-between">
          <span className={`text-sm ${highlight ? 'text-rt-orange-600 font-semibold' : 'text-rt-muted'}`}>
            {label}
          </span>
          <span
            className={`font-mono ${
              highlight ? 'text-xl font-bold text-rt-orange-600' : 'text-sm text-rt-text'
            }`}
          >
            {formatMoney(value)}
          </span>
        </div>
      ))}
    </div>
  );
}