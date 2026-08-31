// Lightweight JWT helpers — decoding only. Signature verification always
// happens server-side; the frontend just needs to read the claims and
// know when the token expires.

export function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

export function getTokenRemainingMs(token) {
  const payload = decodeJwt(token);
  if (!payload?.exp) return 0;
  return Math.max(payload.exp * 1000 - Date.now(), 0);
}