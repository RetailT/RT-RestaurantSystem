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
    <header className="flex items-center justify-between px-5 py-3 bg-white/90 backdrop-blur border-b border-rt-border shadow-card">
      <div className="flex items-center gap-3">
        <span className="font-display font-bold text-2xl">
          <span className="text-rt-text">RT</span>
          <span className="text-rt-orange-500">POS</span>
        </span>
        <span className="hidden sm:inline text-xs uppercase tracking-widest text-rt-orange-600/60 border-l border-rt-border pl-3">
          Restaurant Order
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="hidden md:flex flex-col items-end leading-tight">
          <span className="text-rt-text font-semibold">{cashier?.name || cashier?.cashierCode}</span>
          <span className="text-rt-orange-600/60 text-xs">Cashier · {cashier?.cashierCode}</span>
        </div>
        <div className="hidden sm:flex flex-col items-end leading-tight px-3 border-l border-rt-border">
          <span className="text-rt-text font-mono">{formatTime(now)}</span>
          <span className="text-rt-orange-600/60 text-xs">{formatDate(now)}</span>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-rt-orange-300 text-rt-orange-600 hover:bg-rt-orange-500 hover:text-white hover:border-rt-orange-500 font-semibold text-sm px-4 py-2 transition"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}