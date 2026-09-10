import api, { USE_MOCK_DATA } from '../config/api.js';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getNextInvoiceNo(unitNo) {
  if (USE_MOCK_DATA) {
    await delay(150);
    const seq = Math.floor(1000000000 + Math.random() * 8999999);
    return { invoiceNo: String(seq) };
  }
  const { data } = await api.get('/invoices/next', { params: { unitNo } });
  return data;
}

/**
 * Real endpoint: POST /orders — the backend moves the cashier's current
 * tb_SUSPENDTEMP rows into tb_SUSPEND. No items/totals need to be sent;
 * the cart is already persisted server-side.
 */
export async function submitOrder({ companyCode, unitNo, orderNote }) {
  if (USE_MOCK_DATA) {
    await delay(500);
    return { success: true };
  }
  const { data } = await api.post('/orders', { companyCode, unitNo, orderNote });
  return data;
}