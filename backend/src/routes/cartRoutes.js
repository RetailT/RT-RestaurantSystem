const express = require('express');
const requireAuth = require('../middleware/auth');
const {
  getCart,
  addItem,
  updateItem,
  removeItem,
  updateCartType,
  updateCartComment
} = require('../controllers/cartController');

const router = express.Router();

router.get('/cart', requireAuth, getCart);
router.post('/cart/items', requireAuth, addItem);
router.patch('/cart/items/:idx', requireAuth, updateItem);
router.delete('/cart/items/:idx', requireAuth, removeItem);
router.patch('/cart/type', requireAuth, updateCartType);
router.patch('/cart/comment', requireAuth, updateCartComment);

module.exports = router;