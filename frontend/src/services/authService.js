import api, { USE_MOCK_DATA } from '../config/api.js';
import { mockCashiers } from '../data/mockData.js';

/**
 * Expected real endpoint: POST /auth/login  { username, password }
 * Backend should check the credentials against the cashier table already
 * registered in the POS (e.g. tb_USERS) and return:
 *   { token, cashier: { cashierCode, username, name } }
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
    const fakeToken = `mock-token-${match.cashierCode}`;
    return {
      token: fakeToken,
      cashier: { cashierCode: match.cashierCode, username: match.username, name: match.name }
    };
  }

  const { data } = await api.post('/auth/login', { username, password });
  return data;
}

export function saveSession({ token, cashier }) {
  sessionStorage.setItem('rtpos_token', token);
  sessionStorage.setItem('rtpos_cashier', JSON.stringify(cashier));
}

export function loadSession() {
  const token = sessionStorage.getItem('rtpos_token');
  const cashierRaw = sessionStorage.getItem('rtpos_cashier');
  if (!token || !cashierRaw) return null;
  try {
    return { token, cashier: JSON.parse(cashierRaw) };
  } catch {
    return null;
  }
}

export function clearSession() {
  sessionStorage.removeItem('rtpos_token');
  sessionStorage.removeItem('rtpos_cashier');
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
