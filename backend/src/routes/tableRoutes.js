const express = require('express');
const requireAuth = require('../middleware/auth');
const { getTables } = require('../controllers/tableController');

const router = express.Router();
router.get('/tables', requireAuth, getTables);

module.exports = router;