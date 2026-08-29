import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatDate, formatTime } from '../../utils/format.js';

export default function Header() {
  const { cashier, signOut } = useAuth();
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  function handleLogout() {
    signOut();
    navigate('/login', { replace: true });
  }

  return (
    <header className="flex items-center justify-between px-5 py-3 bg-rt-charcoal/90 border-b border-rt-border shadow-panel">
      <div className="flex items-center gap-3">
        <span className="font-display font-bold text-2xl">
          <span className="text-white">RT</span>
          <span className="text-rt-orange-500">POS</span>
        </span>
        <span className="hidden sm:inline text-xs uppercase tracking-widest text-rt-orange-200/50 border-l border-rt-border pl-3">
          Restaurant Order
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="hidden md:flex flex-col items-end leading-tight">
          <span className="text-white font-semibold">{cashier?.name || cashier?.cashierCode}</span>
          <span className="text-rt-orange-200/50 text-xs">Cashier · {cashier?.cashierCode}</span>
        </div>
        <div className="hidden sm:flex flex-col items-end leading-tight px-3 border-l border-rt-border">
          <span className="text-white font-mono">{formatTime(now)}</span>
          <span className="text-rt-orange-200/50 text-xs">{formatDate(now)}</span>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-rt-orange-600/60 text-rt-orange-300 hover:bg-rt-orange-600 hover:text-black font-semibold text-sm px-4 py-2 transition"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
