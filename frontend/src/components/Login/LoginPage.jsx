import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { login } from '../../services/authService.js';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('Enter both cashier username and password.');
      return;
    }
    setLoading(true);
    try {
      const result = await login(username, password);
      signIn(result);
      navigate('/menu', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-rt-bg px-4 overflow-hidden">
      {/* larger grid, faded out near the center (behind the card) and visible toward the edges */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(232,93,0,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(232,93,0,0.16) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(circle at 50% 40%, transparent 0%, transparent 22%, black 65%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 40%, transparent 0%, transparent 22%, black 65%)'
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-4xl font-display font-bold tracking-wide">
              <span className="text-rt-text">RT</span>
              <span className="text-rt-orange-500">POS</span>
            </span>
          </div>
          <p className="text-rt-orange-600/70 text-sm tracking-widest uppercase">Restaurant Order Terminal</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/95 backdrop-blur border border-rt-border rounded-2xl shadow-panel p-8"
        >
          <h1 className="text-xl font-display font-semibold text-rt-text mb-1">Cashier sign in</h1>
          <p className="text-sm text-rt-muted mb-6">
            Sign in with the cashier account registered on this POS.
          </p>

          <label className="block text-xs font-semibold text-rt-orange-700/80 uppercase tracking-wide mb-1.5">
            Cashier username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. cashier01"
            autoComplete="username"
            className="w-full mb-4 rounded-lg bg-white border border-rt-border text-rt-text placeholder:text-rt-muted/60 px-4 py-3 focus:border-rt-orange-500 focus:ring-2 focus:ring-rt-orange-100 outline-none transition"
          />

          <label className="block text-xs font-semibold text-rt-orange-700/80 uppercase tracking-wide mb-1.5">
            Password
          </label>
          <div className="relative mb-2">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full rounded-lg bg-white border border-rt-border text-rt-text placeholder:text-rt-muted/60 px-4 py-3 pr-16 focus:border-rt-orange-500 focus:ring-2 focus:ring-rt-orange-100 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-rt-orange-600/80 hover:text-rt-orange-600"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {error && (
            <p className="mt-2 mb-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-lg bg-rt-orange-500 hover:bg-rt-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-black font-display font-bold text-lg py-3 shadow-glow transition"
          >
            {loading ? 'Checking…' : 'Sign in'}
          </button>

          <p className="mt-4 text-center text-xs text-rt-muted/80">
            Credentials are verified against the POS cashier records.
          </p>
        </form>
      </div>
    </div>
  );
}