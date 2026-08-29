import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadSession, saveSession, clearSession } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [cashier, setCashier] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = loadSession();
    if (session) setCashier(session.cashier);
    setReady(true);
  }, []);

  function signIn({ token, cashier }) {
    saveSession({ token, cashier });
    setCashier(cashier);
  }

  function signOut() {
    clearSession();
    setCashier(null);
  }

  return (
    <AuthContext.Provider value={{ cashier, isAuthenticated: !!cashier, ready, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
