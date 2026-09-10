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

// POST /orders — moves the cashier's current tb_SUSPENDTEMP cart into tb_SUSPEND
const submitOrder = asyncHandler(async (req, res) => {
  const cashierCode = req.cashier.cashierCode;
  const companyCode = req.body.companyCode || DEFAULT_COMPANY_CODE;
  const unitNo = Number(req.body.unitNo) || DEFAULT_UNITNO;
  const orderNote = req.body.orderNote || null;

  const pool = await getPool();

  const countResult = await pool
    .request()
    .input('companyCode', sql.VarChar, companyCode)
    .input('unitNo', sql.VarChar, String(unitNo))
    .input('cashierCode', sql.VarChar, cashierCode)
    .query(`
      SELECT COUNT(*) AS itemCount
      FROM tb_SUSPENDTEMP
      WHERE COMPANY_CODE = @companyCode AND UNITNO = @unitNo AND CASHIERCODE = @cashierCode
    `);

  if (countResult.recordset[0].itemCount === 0) {
    return res.status(400).json({ message: 'Cart is empty — add items before sending the order.' });
  }

  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const lockRequest = new sql.Request(transaction);
    const posMainResult = await lockRequest
      .input('companyCode', sql.VarChar, companyCode)
      .input('unitNo', sql.Int, unitNo)
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
      .input('unitNo', sql.Int, unitNo)
      .input('suspendNo', sql.Int, newSuspendNo)
      .query(`
        UPDATE tb_POSMAIN
        SET SUSPENDNO = @suspendNo
        WHERE COMPANY_CODE = @companyCode AND UNITNO = @unitNo
      `);

    const moveRequest = new sql.Request(transaction);
    await moveRequest
      .input('companyCode', sql.VarChar, companyCode)
      .input('unitNo', sql.VarChar, String(unitNo))
      .input('cashierCode', sql.VarChar, cashierCode)
      .input('suspendNo', sql.Char(15), String(newSuspendNo))
      .input('orderComment', sql.NVarChar, orderNote)
      .query(`
        INSERT INTO tb_SUSPEND (
          INVOICENO, SUSPENDNO, COMPANY_CODE, UNITNO, UNIT, CASHIERCODE, SALESMAN,
          [DATE], [TIME], PRODUCT_CODE, PRODUCT_NAME, PRODUCT_NAME_SINHALA,
          COST_PRICE, AVGCOST, UNIT_PRICE, QTY, DISCPREC, DISCOUNT, AMOUNT,
          ID, BALANCE, BANKID, RECORDNO, RECORD_INSERTED, UPDATECASHIER,
          TYPE, EXPDATE, BTYPE, EDITPRICE, REFCODE, DISCOUNT_TYPE, SERIALNO,
          COLORCODE, SIZECODE, PROMOCHK, PROMODISC, CARDNO, ORDERNO, UNIT_PRICE2,
          WASTAGE, ISSUE_LOCATION, PRINTED, TAKEDINE_STATUS, TABLEID, COMMENTS,
          ORDER_NOTE, INSERT_TIME
        )
        SELECT
          NULL, @suspendNo, COMPANY_CODE, UNITNO, UNIT, CASHIERCODE, SALESMAN,
          GETDATE(), GETDATE(), PRODUCT_CODE, PRODUCT_NAME, PRODUCT_NAME_SINHALA,
          COST_PRICE, AVGCOST, UNIT_PRICE, QTY, DISCPREC, DISCOUNT, AMOUNT,
          ID, BALANCE, BANKID, RECORDNO, RECORD_INSERTED, UPDATECASHIER,
          TYPE, EXPDATE, BTYPE, EDITPRICE, REFCODE, DISCOUNT_TYPE, SERIALNO,
          COLORCODE, SIZECODE, PROMOCHK, PROMODISC, CARDNO, ORDERNO, UNIT_PRICE2,
          WASTAGE, ISSUE_LOCATION, PRINTED, TAKEDINE_STATUS, TABLEID, @orderComment,
          ORDER_NOTE, GETDATE()
        FROM tb_SUSPENDTEMP
        WHERE COMPANY_CODE = @companyCode AND UNITNO = @unitNo AND CASHIERCODE = @cashierCode
      `);

    const clearRequest = new sql.Request(transaction);
    await clearRequest
      .input('companyCode', sql.VarChar, companyCode)
      .input('unitNo', sql.VarChar, String(unitNo))
      .input('cashierCode', sql.VarChar, cashierCode)
      .query(`
        DELETE FROM tb_SUSPENDTEMP
        WHERE COMPANY_CODE = @companyCode AND UNITNO = @unitNo AND CASHIERCODE = @cashierCode
      `);

    await transaction.commit();
    res.json({ success: true, suspendNo: newSuspendNo });
  } catch (err) {
    await transaction.rollback().catch(() => {});
    throw err;
  }
});

module.exports = { getNextInvoice, submitOrder };