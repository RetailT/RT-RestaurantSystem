const { sql, getPool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

const DEFAULT_COMPANY_CODE = process.env.DEFAULT_COMPANY_CODE || '01';
const DEFAULT_UNITNO = Number(process.env.DEFAULT_UNITNO) || 1;

const getNextInvoice = asyncHandler(async (req, res) => {
  const unitNo = Number(req.query.unitNo) || DEFAULT_UNITNO;
  const pool = await getPool();

  const result = await pool
    .request()
    .input('companyCode', sql.VarChar, DEFAULT_COMPANY_CODE)
    .input('unitNo', sql.Int, unitNo)
    .query(`
      SELECT INVOICENO
      FROM tb_POSMAIN
      WHERE COMPANY_CODE = @companyCode AND UNITNO = @unitNo
    `);

  const row = result.recordset[0];
  res.json({ invoiceNo: row ? String(row.INVOICENO) : null });
});

const submitOrder = asyncHandler(async (req, res) => {
  const { cashierCode, unitNo, orderType, tableNumber, items, orderNote } = req.body;

  const companyCode = req.body.companyCode || DEFAULT_COMPANY_CODE;
  const resolvedUnitNo = Number(unitNo) || DEFAULT_UNITNO;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order must include at least one item.' });
  }

  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const lockRequest = new sql.Request(transaction);
    const posMainResult = await lockRequest
      .input('companyCode', sql.VarChar, companyCode)
      .input('unitNo', sql.Int, resolvedUnitNo)
      .query(`
        SELECT SUSPENDNO
        FROM tb_POSMAIN WITH (UPDLOCK, HOLDLOCK)
        WHERE COMPANY_CODE = @companyCode AND UNITNO = @unitNo
      `);

    const posMainRow = posMainResult.recordset[0];
    if (!posMainRow) {
      const err = new Error('No matching tb_POSMAIN row for this company/unit.');
      err.status = 404;
      err.publicMessage = 'Terminal configuration not found (tb_POSMAIN).';
      throw err;
    }

    const newSuspendNo = Number(posMainRow.SUSPENDNO || 0) + 1;

    const updateRequest = new sql.Request(transaction);
    await updateRequest
      .input('companyCode', sql.VarChar, companyCode)
      .input('unitNo', sql.Int, resolvedUnitNo)
      .input('suspendNo', sql.Int, newSuspendNo)
      .query(`
        UPDATE tb_POSMAIN
        SET SUSPENDNO = @suspendNo
        WHERE COMPANY_CODE = @companyCode AND UNITNO = @unitNo
      `);

    const productCodes = [...new Set(items.map((i) => i.pCode))];
    const productRequest = new sql.Request(transaction);
    const productResult = await productRequest.query(`
      SELECT PRODUCT_CODE, PRODUCT_NAME_SINHALA, COST_PRICE, AVGCOST
      FROM tb_PRODUCT
      WHERE PRODUCT_CODE IN (${productCodes.map((c) => `'${c.replace(/'/g, "''")}'`).join(',')})
    `);
    const productByCode = new Map(productResult.recordset.map((r) => [r.PRODUCT_CODE, r]));

    const takedineStatus = orderType === 'DINE_IN' ? 'DINEIN' : 'TAKEAWAY';
    const tableId = orderType === 'DINE_IN' ? tableNumber : null;

    let orderNo = 1;
    for (const item of items) {
      const product = productByCode.get(item.pCode) || {};
      const grossAmount = Number(item.uPrice) * Number(item.qty);
      const discount = Number(item.discount) || (grossAmount * (Number(item.disPercent) || 0)) / 100;
      const amount = grossAmount - discount;

      const itemRequest = new sql.Request(transaction);
      await itemRequest
        .input('invoiceNo', sql.VarChar, null)
        .input('suspendNo', sql.Int, newSuspendNo)
        .input('companyCode', sql.VarChar, companyCode)
        .input('unitNo', sql.Int, resolvedUnitNo)
        .input('unit', sql.VarChar, String(resolvedUnitNo))
        .input('cashierCode', sql.VarChar, cashierCode)
        .input('productCode', sql.VarChar, item.pCode)
        .input('productName', sql.VarChar, item.description)
        .input('productNameSinhala', sql.NVarChar, product.PRODUCT_NAME_SINHALA || null)
        .input('costPrice', sql.Decimal(18, 2), product.COST_PRICE || 0)
        .input('avgCost', sql.Decimal(18, 2), product.AVGCOST || 0)
        .input('unitPrice', sql.Decimal(18, 2), item.uPrice)
        .input('qty', sql.Decimal(18, 3), item.qty)
        .input('discPrec', sql.Decimal(9, 2), item.disPercent || 0)
        .input('discount', sql.Decimal(18, 2), discount)
        .input('amount', sql.Decimal(18, 2), amount)
        .input('orderNo', sql.Int, orderNo)
        .input('takedineStatus', sql.VarChar, takedineStatus)
        .input('tableId', sql.Int, tableId)
        // CHANGED: whole-order special comment now goes to COMMENTS
        .input('comments', sql.NVarChar, orderNote || null)
        // CHANGED: per-item "+ Add note" now goes to ORDER_NOTE
        .input('orderNote', sql.NVarChar, item.note || null)
        .query(`
          INSERT INTO tb_SUSPEND (
            INVOICENO, SUSPENDNO, COMPANY_CODE, UNITNO, UNIT, CASHIERCODE,
            [DATE], [TIME], PRODUCT_CODE, PRODUCT_NAME, PRODUCT_NAME_SINHALA,
            COST_PRICE, AVGCOST, UNIT_PRICE, QTY, DISCPREC, DISCOUNT, AMOUNT,
            ORDERNO, TAKEDINE_STATUS, TABLEID, COMMENTS, ORDER_NOTE, INSERT_TIME
          ) VALUES (
            @invoiceNo, @suspendNo, @companyCode, @unitNo, @unit, @cashierCode,
            CONVERT(date, GETDATE()), CONVERT(time, GETDATE()), @productCode, @productName, @productNameSinhala,
            @costPrice, @avgCost, @unitPrice, @qty, @discPrec, @discount, @amount,
            @orderNo, @takedineStatus, @tableId, @comments, @orderNote, GETDATE()
          )
        `);

      orderNo += 1;
    }

    await transaction.commit();
    res.json({ success: true, suspendNo: newSuspendNo });
  } catch (err) {
    await transaction.rollback().catch(() => {});
    throw err;
  }
});

module.exports = { getNextInvoice, submitOrder };