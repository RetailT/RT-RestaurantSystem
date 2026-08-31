import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { loadSession, saveSession, clearSession } from '../services/authService.js';
import { decodeJwt, isTokenExpired, getTokenRemainingMs } from '../utils/jwt.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [cashier, setCashier] = useState(null);
  const [ready, setReady] = useState(false);
  const logoutTimer = useRef(null);

  const signOut = useCallback(() => {
    clearSession();
    setCashier(null);
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = null;
    }
  }, []);

  const scheduleAutoLogout = useCallback(
    (token) => {
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
      const remaining = getTokenRemainingMs(token);
      if (remaining <= 0) return;
      logoutTimer.current = setTimeout(signOut, remaining);
    },
    [signOut]
  );

  useEffect(() => {
    const session = loadSession();
    if (session && !isTokenExpired(session.token)) {
      setCashier(session.cashier);
      scheduleAutoLogout(session.token);
    } else if (session) {
      clearSession(); // stale/expired token left over from a previous visit
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If any API call gets a 401 (token invalid/expired server-side), log out.
  useEffect(() => {
    window.addEventListener('auth:logout', signOut);
    return () => window.removeEventListener('auth:logout', signOut);
  }, [signOut]);

  function signIn({ token }) {
    saveSession(token);
    setCashier(decodeJwt(token));
    scheduleAutoLogout(token);
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