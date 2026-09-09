const { getPool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

const getTables = asyncHandler(async (req, res) => {
  const pool = await getPool();

  const tablesResult = await pool.request().query(`
    SELECT TABLEID, TABLE_NAME
    FROM tb_REST_TABLE
    ORDER BY TABLEID
  `);

  const occupiedResult = await pool.request().query(`
    SELECT DISTINCT TABLEID
    FROM tb_SUSPEND
    WHERE TAKEDINE_STATUS = 'DINEIN'
      AND CAST([DATE] AS DATE) = CAST(GETDATE() AS DATE)
  `);

  const occupiedIds = new Set(occupiedResult.recordset.map((r) => r.TABLEID));

  const tables = tablesResult.recordset.map((row) => ({
    number: row.TABLEID,
    capacity: null,
    status: occupiedIds.has(row.TABLEID) ? 'occupied' : 'available',
    name: row.TABLE_NAME
  }));

  res.json(tables);
});

module.exports = { getTables };