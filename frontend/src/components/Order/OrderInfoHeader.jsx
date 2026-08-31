import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useOrder } from '../../context/OrderContext.jsx';
import { TERMINAL_INFO } from '../../config/api.js';
import { formatDate, formatTime } from '../../utils/format.js';

export default function OrderInfoHeader() {
  const { cashier } = useAuth();
  const { invoiceNo } = useOrder();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fields = [
    ['Company Code', TERMINAL_INFO.companyCode],
    ['Invoice No.', invoiceNo],
    ['Cashier Code', cashier?.cashierCode || '—'],
    ['Unit No.', TERMINAL_INFO.unitNo],
    ['Measurement', TERMINAL_INFO.measurement],
    ['Printer Type', TERMINAL_INFO.printerType],
    ['Date', formatDate(now)],
    ['Time', formatTime(now)]
  ];

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3 bg-rt-surfacealt border border-rt-border rounded-xl px-4 py-3">
      {fields.map(([label, value]) => (
        <div key={label} className="flex flex-col items-start min-w-0">
          <span className="text-rt-orange-600 uppercase tracking-wide text-[10px] font-semibold leading-tight mb-0.5">
            {label}
          </span>
          <span
            className="text-rt-text font-mono font-semibold text-sm truncate w-full"
            title={String(value)}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}