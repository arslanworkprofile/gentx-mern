const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const fmt = (u) => ({ _id: u._id, name: u.name, email: u.email, role: u.role, avatar: u.avatar, phone: u.phone, address: u.address, isBlocked: u.isBlocked });

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) { res.status(400); throw new Error('All fields required'); }
  if (await User.findOne({ email })) { res.status(400); throw new Error('Email already registered'); }
  const user = await User.create({ name, email, password });
  res.status(201).json({ success: true, token: generateToken(user._id), user: fmt(user) });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400); throw new Error('Email and password required'); }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) { res.status(401); throw new Error('Invalid credentials'); }
  if (user.isBlocked) { res.status(403); throw new Error('Account blocked – contact support'); }
  res.json({ success: true, token: generateToken(user._id), user: fmt(user) });
});

// GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user: fmt(user) });
});

// PUT /api/auth/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  const { name, phone, address, password } = req.body;
  if (name)    user.name    = name;
  if (phone)   user.phone   = phone;
  if (address) user.address = { ...user.address, ...address };
  if (password) {
    if (password.length < 6) { res.status(400); throw new Error('Password min 6 chars'); }
    user.password = password;
  }
  const updated = await user.save();
  res.json({ success: true, user: fmt(updated) });
});
