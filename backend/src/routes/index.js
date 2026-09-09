const express = require('express');
const authRoutes = require('./authRoutes');
const catalogRoutes = require('./catalogRoutes');
const tableRoutes = require('./tableRoutes');
const orderRoutes = require('./orderRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/', catalogRoutes);
router.use('/', tableRoutes);
router.use('/', orderRoutes);

module.exports = router;