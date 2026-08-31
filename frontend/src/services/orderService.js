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
 * Expected real endpoint: POST /orders
 * Body: {
 *   companyCode, cashierCode, unitNo, invoiceNo,
 *   orderType: 'TAKEAWAY' | 'DINE_IN', tableNumber,
 *   items: [{ pCode, description, uPrice, qty, disPercent, discount, amount, note }],
 *   totals: { total, totalDiscount, netTotal, paidAmount, balance },
 *   orderNote: string | null   // whole-order special instructions (separate from per-item note)
 * }
 */
export async function submitOrder(orderPayload) {
  if (USE_MOCK_DATA) {
    await delay(500);
    return { success: true, invoiceNo: orderPayload.invoiceNo };
  }
  const { data } = await api.post('/orders', orderPayload);
  return data;
}