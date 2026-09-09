const express = require('express');
const requireAuth = require('../middleware/auth');
const { getNextInvoice, submitOrder } = require('../controllers/orderController');

const router = express.Router();

router.get('/invoices/next', requireAuth, getNextInvoice);
router.post('/orders', requireAuth, submitOrder);

module.exports = router;