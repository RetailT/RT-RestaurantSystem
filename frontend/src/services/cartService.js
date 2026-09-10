import api from '../config/api.js';

/**
 * All calls below hit the cashier's tb_SUSPENDTEMP row set (identified server-side
 * from the JWT + companyCode/unitNo).
 */
export async function fetchCart({ companyCode, unitNo }) {
  const { data } = await api.get('/cart', { params: { companyCode, unitNo } });
  return data; // { items, orderComment }
}

export async function addCartItem({ companyCode, unitNo, pCode, uPrice, qty, disPercent, discount, orderType, tableNumber, note }) {
  const { data } = await api.post('/cart/items', {
    companyCode,
    unitNo,
    pCode,
    uPrice,
    qty,
    disPercent,
    discount,
    orderType,
    tableNumber,
    note
  });
  return data;
}

export async function updateCartItem(idx, { qty, disPercent, discount, note }) {
  const { data } = await api.patch(`/cart/items/${idx}`, { qty, disPercent, discount, note });
  return data;
}

export async function removeCartItem(idx) {
  const { data } = await api.delete(`/cart/items/${idx}`);
  return data;
}

export async function updateCartType({ companyCode, unitNo, orderType, tableNumber }) {
  const { data } = await api.patch('/cart/type', { companyCode, unitNo, orderType, tableNumber });
  return data;
}

export async function updateCartComment({ companyCode, unitNo, comment }) {
  const { data } = await api.patch('/cart/comment', { companyCode, unitNo, comment });
  return data;
}