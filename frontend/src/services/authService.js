import api, { USE_MOCK_DATA } from '../config/api.js';
import { mockCashiers } from '../data/mockData.js';
import { decodeJwt } from '../utils/jwt.js';

/**
 * Expected real endpoint: POST /auth/login  { username, password }
 * Backend should check the credentials against the cashier table already
 * registered in the POS (e.g. tb_USERS) and return a signed JWT:
 *   { token }
 * The JWT payload MUST include at least:
 *   { cashierCode, username, name, exp }   (exp = unix seconds expiry)
 */
export async function login(username, password) {
  if (USE_MOCK_DATA) {
    await delay(400);
    const match = mockCashiers.find(
      (c) => c.username.toLowerCase() === username.trim().toLowerCase() && c.password === password
    );
    if (!match) {
      const err = new Error('Invalid cashier username or password');
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }
    const token = createMockJwt({
      cashierCode: match.cashierCode,
      username: match.username,
      name: match.name
    });
    return { token };
  }

  const { data } = await api.post('/auth/login', { username, password });
  return data; // expected: { token }
}

export function saveSession(token) {
  sessionStorage.setItem('rtpos_token', token);
}

export function loadSession() {
  const token = sessionStorage.getItem('rtpos_token');
  if (!token) return null;
  const cashier = decodeJwt(token);
  if (!cashier) return null;
  return { token, cashier };
}

export function clearSession() {
  sessionStorage.removeItem('rtpos_token');
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- mock-only JWT builder (header.payload.signature, all base64url) ---
// Real backend should sign this with its own secret; the shape (exp/claims)
// just needs to match so the frontend decode logic works identically.
function base64UrlEncode(obj) {
  const json = JSON.stringify(obj);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function createMockJwt(payload) {
  const ttlSeconds = Number(process.env.REACT_APP_MOCK_JWT_TTL_SECONDS) || 8 * 60 * 60; // 8h default
  const header = { alg: 'none', typ: 'JWT' };
  const fullPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + ttlSeconds
  };
  return `${base64UrlEncode(header)}.${base64UrlEncode(fullPayload)}.mock-signature`;
}