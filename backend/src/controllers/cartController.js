const { sql, getPool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

const DEFAULT_COMPANY_CODE = process.env.DEFAULT_COMPANY_CODE || '01';
const DEFAULT_UNITNO = Number(process.env.DEFAULT_UNITNO) || 1;

function resolveContext(req) {
  const companyCode = req.body.companyCode || req.query.companyCode || DEFAULT_COMPANY_CODE;
  const unitNo = Number(req.body.unitNo || req.query.unitNo) || DEFAULT_UNITNO;
  const cashierCode = req.cashier.cashierCode;
  return { companyCode, unitNo, cashierCode };
}

// GET /cart?unitNo=1
const getCart = asyncHandler(async (req, res) => {
  const { companyCode, unitNo, cashierCode } = resolveContext(req);
  const pool = await getPool();

  const result = await pool
    .request()
    .input('companyCode', sql.VarChar, companyCode)
    .input('unitNo', sql.VarChar, String(unitNo))
    .input('cashierCode', sql.VarChar, cashierCode)
    .query(`
      SELECT *
      FROM tb_SUSPENDTEMP
      WHERE COMPANY_CODE = @companyCode AND UNITNO = @unitNo AND CASHIERCODE = @cashierCode
      ORDER BY
        CASE WHEN ISNUMERIC(ORDERNO) = 1 THEN CAST(ORDERNO AS INT) ELSE 0 END
    `);

  const items = result.recordset.map((row) => ({
    idx: row.IDX,
    pCode: row.PRODUCT_CODE,
    name: row.PRODUCT_NAME,
    unitPrice: Number(row.UNIT_PRICE) || 0,
    qty: Number(row.QTY) || 0,
    discPercent: Number(row.DISCPREC) || 0,
    discount: Number(row.DISCOUNT) || 0,
    amount: Number(row.AMOUNT) || 0,
    orderNo: row.ORDERNO,
    orderType: row.TAKEDINE_STATUS,
    tableNumber: row.TABLEID,
    note: row.ORDER_NOTE
  }));

  // whole-order comment is the same on every row — read it off the first one
  const orderComment = result.recordset[0]?.COMMENTS || '';

  res.json({ items, orderComment });
});

// POST /cart/items
const addItem = asyncHandler(async (req, res) => {
  const { companyCode, unitNo, cashierCode } = resolveContext(req);
  const { pCode, qty, disPercent, discount: discountOverride, orderType, tableNumber, note, uPrice } = req.body;

  if (!pCode || !qty || Number(qty) <= 0) {
    return res.status(400).json({ message: 'pCode and a positive qty are required.' });
  }
  if (orderType === 'DINE_IN' && !tableNumber) {
    return res.status(400).json({ message: 'tableNumber is required for dine-in orders.' });
  }

  const pool = await getPool();

  const productResult = await pool
    .request()
    .input('pCode', sql.VarChar, pCode)
    .query(`
      SELECT PRODUCT_CODE, PRODUCT_NAME, PRODUCT_NAME_SINHALA, COST_PRICE, AVGCOST, UNIT_PRICE
      FROM tb_PRODUCT
      WHERE PRODUCT_CODE = @pCode
    `);

  const product = productResult.recordset[0];
  if (!product) {
    return res.status(404).json({ message: `Product ${pCode} not found.` });
  }

  const unitPrice = uPrice != null ? Number(uPrice) : Number(product.UNIT_PRICE) || 0;
  const grossAmount = unitPrice * Number(qty);
  const discPercent = Number(disPercent) || 0;
  const discount = discountOverride != null ? Number(discountOverride) : (grossAmount * discPercent) / 100;
  const amount = grossAmount - discount;

  const takedineStatus = orderType === 'DINE_IN' ? 'DINEIN' : 'TAKEAWAY';
  const tableId = orderType === 'DINE_IN' ? String(tableNumber) : null;

  // carry over the whole-order comment already on the cart (if any) onto the new row
  const existingCommentResult = await pool
    .request()
    .input('companyCode', sql.VarChar, companyCode)
    .input('unitNo', sql.VarChar, String(unitNo))
    .input('cashierCode', sql.VarChar, cashierCode)
    .query(`
      SELECT TOP 1 COMMENTS
      FROM tb_SUSPENDTEMP
      WHERE COMPANY_CODE = @companyCode AND UNITNO = @unitNo AND CASHIERCODE = @cashierCode
    `);
  const carriedComment = existingCommentResult.recordset[0]?.COMMENTS || null;

  const orderNoResult = await pool
    .request()
    .input('companyCode', sql.VarChar, companyCode)
    .input('unitNo', sql.VarChar, String(unitNo))
    .input('cashierCode', sql.VarChar, cashierCode)
    .query(`
      SELECT ISNULL(MAX(
        CASE WHEN ISNUMERIC(ORDERNO) = 1 THEN CAST(ORDERNO AS INT) ELSE 0 END
      ), 0) + 1 AS nextOrderNo
      FROM tb_SUSPENDTEMP
      WHERE COMPANY_CODE = @companyCode AND UNITNO = @unitNo AND CASHIERCODE = @cashierCode
    `);
  const nextOrderNo = orderNoResult.recordset[0].nextOrderNo;

  await pool
    .request()
    .input('companyCode', sql.VarChar, companyCode)
    .input('unitNo', sql.VarChar, String(unitNo))
    .input('unit', sql.VarChar, String(unitNo))
    .input('cashierCode', sql.VarChar, cashierCode)
    .input('productCode', sql.VarChar, product.PRODUCT_CODE)
    .input('productName', sql.NVarChar, product.PRODUCT_NAME)
    .input('productNameSinhala', sql.NVarChar, product.PRODUCT_NAME_SINHALA || null)
    .input('costPrice', sql.Money, product.COST_PRICE || 0)
    .input('avgCost', sql.Money, product.AVGCOST || 0)
    .input('unitPrice', sql.Money, unitPrice)
    .input('qty', sql.Float, Number(qty))
    .input('discPrec', sql.Money, discPercent)
    .input('discount', sql.Money, discount)
    .input('amount', sql.Money, amount)
    .input('orderNo', sql.NVarChar, String(nextOrderNo))
    .input('takedineStatus', sql.NVarChar, takedineStatus)
    .input('tableId', sql.NVarChar, tableId)
    .input('orderNote', sql.NVarChar, note || null)
    .input('comment', sql.NVarChar, carriedComment)
    .query(`
      INSERT INTO tb_SUSPENDTEMP (
        COMPANY_CODE, UNITNO, UNIT, CASHIERCODE, PRODUCT_CODE, PRODUCT_NAME, PRODUCT_NAME_SINHALA,
        COST_PRICE, AVGCOST, UNIT_PRICE, QTY, DISCPREC, DISCOUNT, AMOUNT,
        ORDERNO, TAKEDINE_STATUS, TABLEID, ORDER_NOTE, COMMENTS
      ) VALUES (
        @companyCode, @unitNo, @unit, @cashierCode, @productCode, @productName, @productNameSinhala,
        @costPrice, @avgCost, @unitPrice, @qty, @discPrec, @discount, @amount,
        @orderNo, @takedineStatus, @tableId, @orderNote, @comment
      )
    `);

  res.status(201).json({ success: true, orderNo: nextOrderNo });
});

// PATCH /cart/items/:idx
const updateItem = asyncHandler(async (req, res) => {
  const { cashierCode } = resolveContext(req);
  const idx = Number(req.params.idx);
  const { qty, disPercent, discount: discountOverride, note } = req.body;

  const pool = await getPool();

  const existingResult = await pool
    .request()
    .input('idx', sql.Numeric, idx)
    .input('cashierCode', sql.VarChar, cashierCode)
    .query(`
      SELECT IDX, UNIT_PRICE, QTY, DISCPREC
      FROM tb_SUSPENDTEMP
      WHERE IDX = @idx AND CASHIERCODE = @cashierCode
    `);

  const existing = existingResult.recordset[0];
  if (!existing) {
    return res.status(404).json({ message: 'Cart item not found.' });
  }

  const newQty = qty != null ? Number(qty) : Number(existing.QTY);
  if (newQty <= 0) {
    return res.status(400).json({ message: 'qty must be greater than 0.' });
  }
  const unitPrice = Number(existing.UNIT_PRICE) || 0;
  const grossAmount = unitPrice * newQty;
  const newDiscPercent = disPercent != null ? Number(disPercent) : Number(existing.DISCPREC) || 0;
  const newDiscount = discountOverride != null ? Number(discountOverride) : (grossAmount * newDiscPercent) / 100;
  const newAmount = grossAmount - newDiscount;

  await pool
    .request()
    .input('idx', sql.Numeric, idx)
    .input('cashierCode', sql.VarChar, cashierCode)
    .input('qty', sql.Float, newQty)
    .input('discPrec', sql.Money, newDiscPercent)
    .input('discount', sql.Money, newDiscount)
    .input('amount', sql.Money, newAmount)
    .input('orderNote', sql.NVarChar, note !== undefined ? note : null)
    .query(`
      UPDATE tb_SUSPENDTEMP
      SET QTY = @qty, DISCPREC = @discPrec, DISCOUNT = @discount, AMOUNT = @amount,
          ORDER_NOTE = COALESCE(@orderNote, ORDER_NOTE)
      WHERE IDX = @idx AND CASHIERCODE = @cashierCode
    `);

  res.json({ success: true });
});

// DELETE /cart/items/:idx
const removeItem = asyncHandler(async (req, res) => {
  const { cashierCode } = resolveContext(req);
  const idx = Number(req.params.idx);
  const pool = await getPool();

  const result = await pool
    .request()
    .input('idx', sql.Numeric, idx)
    .input('cashierCode', sql.VarChar, cashierCode)
    .query(`
      DELETE FROM tb_SUSPENDTEMP
      WHERE IDX = @idx AND CASHIERCODE = @cashierCode
    `);

  if (result.rowsAffected[0] === 0) {
    return res.status(404).json({ message: 'Cart item not found.' });
  }

  res.json({ success: true });
});

// PATCH /cart/type — bulk update order type / table for the cashier's whole cart
const updateCartType = asyncHandler(async (req, res) => {
  const { companyCode, unitNo, cashierCode } = resolveContext(req);
  const { orderType, tableNumber } = req.body;

  const takedineStatus = orderType === 'DINE_IN' ? 'DINEIN' : 'TAKEAWAY';
  const tableId = orderType === 'DINE_IN' ? String(tableNumber || '') : null;

  const pool = await getPool();
  await pool
    .request()
    .input('companyCode', sql.VarChar, companyCode)
    .input('unitNo', sql.VarChar, String(unitNo))
    .input('cashierCode', sql.VarChar, cashierCode)
    .input('takedineStatus', sql.NVarChar, takedineStatus)
    .input('tableId', sql.NVarChar, tableId)
    .query(`
      UPDATE tb_SUSPENDTEMP
      SET TAKEDINE_STATUS = @takedineStatus, TABLEID = @tableId
      WHERE COMPANY_CODE = @companyCode AND UNITNO = @unitNo AND CASHIERCODE = @cashierCode
    `);

  res.json({ success: true });
});

// PATCH /cart/comment — bulk update the whole-order comment (COMMENTS) for the cashier's cart
const updateCartComment = asyncHandler(async (req, res) => {
  const { companyCode, unitNo, cashierCode } = resolveContext(req);
  const { comment } = req.body;

  const pool = await getPool();
  await pool
    .request()
    .input('companyCode', sql.VarChar, companyCode)
    .input('unitNo', sql.VarChar, String(unitNo))
    .input('cashierCode', sql.VarChar, cashierCode)
    .input('comment', sql.NVarChar, comment || null)
    .query(`
      UPDATE tb_SUSPENDTEMP
      SET COMMENTS = @comment
      WHERE COMPANY_CODE = @companyCode AND UNITNO = @unitNo AND CASHIERCODE = @cashierCode
    `);

  res.json({ success: true });
});

module.exports = { getCart, addItem, updateItem, removeItem, updateCartType, updateCartComment };