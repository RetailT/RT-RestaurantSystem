const { sql, getPool } = require('../config/db');
const { signCashierToken } = require('../utils/jwt');
const asyncHandler = require('../utils/asyncHandler');

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const pool = await getPool();
  const result = await pool
    .request()
    .input('cashierCode', sql.VarChar, username.trim())
    .query(`
      SELECT TOP 1 IDX, CASHIER_CODE, CASHIER_NAME, PASSWORD
      FROM tb_CASHIER
      WHERE CASHIER_CODE = @cashierCode
    `);

  const row = result.recordset[0];

  // tb_CASHIER.PASSWORD is a fixed-length CHAR column in this schema, so SQL Server
  // pads it with trailing spaces on read. Trim both sides before comparing, or a
  // correct password will fail to match.
  const dbPassword = row ? String(row.PASSWORD).trim() : null;
  const suppliedPassword = String(password).trim();

  if (!row || dbPassword !== suppliedPassword) {
    return res.status(401).json({ message: 'Invalid cashier username or password.' });
  }

  const cashier = {
    idx: row.IDX,
    cashierCode: String(row.CASHIER_CODE).trim(),
    name: String(row.CASHIER_NAME).trim()
  };

  const token = signCashierToken(cashier);
  res.json({ token });
});

module.exports = { login };