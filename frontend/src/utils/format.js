export function formatMoney(value) {
  const num = Number(value) || 0;
  return num.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatDate(date = new Date()) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export function formatTime(date = new Date()) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export function calculateLineAmount(item) {
  const gross = item.uPrice * item.qty;
  const discount = item.discount || (gross * (item.disPercent || 0)) / 100;
  return Math.max(gross - discount, 0);
}

export function calculateTotals(items, paidAmount = 0) {
  const total = items.reduce((sum, item) => sum + item.uPrice * item.qty, 0);
  const totalDiscount = items.reduce((sum, item) => {
    const gross = item.uPrice * item.qty;
    const discount = item.discount || (gross * (item.disPercent || 0)) / 100;
    return sum + discount;
  }, 0);
  const netTotal = total - totalDiscount;
  const balance = Math.max(netTotal - paidAmount, 0);
  return { total, totalDiscount, netTotal, paidAmount, balance };
}
