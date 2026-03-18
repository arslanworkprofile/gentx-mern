const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) { res.status(401); throw new Error('Not authorized – no token'); }
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user)     { res.status(401); throw new Error('User not found'); }
    if (req.user.isBlocked) { res.status(403); throw new Error('Account blocked – contact support'); }
    next();
  } catch {
    res.status(401); throw new Error('Not authorized – token invalid');
  }
});

const admin = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403); throw new Error('Admin access required');
};

module.exports = { protect, admin };
