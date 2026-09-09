const express = require('express');
const requireAuth = require('../middleware/auth');
const { getDepartments, getCategories, getProducts } = require('../controllers/catalogController');

const router = express.Router();

router.get('/departments', requireAuth, getDepartments);
router.get('/departments/:departmentId/categories', requireAuth, getCategories);
router.get('/categories/:categoryId/products', requireAuth, getProducts);

module.exports = router;