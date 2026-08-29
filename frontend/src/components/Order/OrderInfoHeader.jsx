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
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 bg-rt-surfacealt/60 border border-rt-border rounded-xl px-4 py-3">
      {fields.map(([label, value]) => (
        <div key={label} className="flex items-center justify-between gap-2 text-xs">
          <span className="text-rt-orange-600/60 uppercase tracking-wide">{label}</span>
          <span className="text-rt-text font-mono font-semibold truncate">{value}</span>
        </div>
      ))}
    </div>
  );
}