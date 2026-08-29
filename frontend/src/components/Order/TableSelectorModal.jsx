import React, { useEffect, useState } from 'react';
import { getTables } from '../../services/tableService.js';

export default function TableSelectorModal({ open, currentTable, onSelect, onClose }) {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getTables()
      .then(setTables)
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-rt-charcoal border border-rt-border rounded-2xl shadow-panel p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg text-white">Select a table</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none">
            ✕
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-rt-card/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1">
            {tables.map((t) => {
              const disabled = t.status === 'occupied';
              const selected = currentTable === t.number;
              return (
                <button
                  key={t.number}
                  disabled={disabled}
                  onClick={() => {
                    onSelect(t.number);
                    onClose();
                  }}
                  className={`aspect-square rounded-xl border flex flex-col items-center justify-center gap-0.5 font-display font-semibold transition ${
                    disabled
                      ? 'bg-rt-black/40 border-rt-border text-white/20 cursor-not-allowed'
                      : selected
                      ? 'bg-rt-orange-500 border-rt-orange-500 text-black shadow-glow'
                      : 'bg-rt-card border-rt-border text-white hover:border-rt-orange-500/60'
                  }`}
                >
                  <span className="text-lg">{t.number}</span>
                  <span className="text-[10px] uppercase tracking-wide">
                    {disabled ? 'Occupied' : `${t.capacity} seats`}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <p className="text-xs text-white/30 mt-4">Tables shown greyed out are currently occupied.</p>
      </div>
    </div>
  );
}
