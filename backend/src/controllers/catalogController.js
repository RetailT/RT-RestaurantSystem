const { sql, getPool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

const getDepartments = asyncHandler(async (req, res) => {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT DISTINCT DEPTCODE, DEPTNAME
    FROM tb_MAINMENU
    ORDER BY DEPTNAME
  `);

  const departments = result.recordset.map((row) => ({
    id: row.DEPTCODE,
    code: row.DEPTCODE,
    name: row.DEPTNAME
  }));

  res.json(departments);
});

const getCategories = asyncHandler(async (req, res) => {
  const { departmentId } = req.params;
  const pool = await getPool();
  const result = await pool
    .request()
    .input('deptCode', sql.VarChar, departmentId)
    .query(`
      SELECT DISTINCT CATCODE, CATNAME
      FROM tb_MAINMENU
      WHERE DEPTCODE = @deptCode
      ORDER BY CATNAME
    `);

  const categories = result.recordset.map((row) => ({
    id: row.CATCODE,
    name: row.CATNAME
  }));

  res.json(categories);
});

const getProducts = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const pool = await getPool();
  const result = await pool
    .request()
    .input('catCode', sql.VarChar, categoryId)
    .query(`
      SELECT
        m.PRODUCT_CODE,
        p.PRODUCT_NAME,
        p.UNIT_PRICE,
        p.PRODUCTIMAGE
      FROM tb_MAINMENU m
      INNER JOIN tb_PRODUCT p ON p.PRODUCT_CODE = m.PRODUCT_CODE
      WHERE m.CATCODE = @catCode
      ORDER BY m.ORDERNO
    `);

  const products = result.recordset.map((row) => ({
    pCode: row.PRODUCT_CODE,
    name: row.PRODUCT_NAME,
    price: Number(row.UNIT_PRICE) || 0,
    image: row.PRODUCTIMAGE || null
  }));

  res.json(products);
});

module.exports = { getDepartments, getCategories, getProducts };