const jwt = require('jsonwebtoken');

function signCashierToken(cashier) {
  return jwt.sign(
    {
      cashierCode: cashier.cashierCode,
      name: cashier.name,
      idx: cashier.idx
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { signCashierToken, verifyToken };