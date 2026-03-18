const asyncHandler = require('express-async-handler');
const User = require('../models/User');

exports.getAllUsers = asyncHandler(async (req, res) => {
  const page = +req.query.page || 1, limit = +req.query.limit || 20;
  const q = {};
  if (req.query.search) q.$or = [{ name: { $regex: req.query.search, $options: 'i' } }, { email: { $regex: req.query.search, $options: 'i' } }];
  if (req.query.role) q.role = req.query.role;
  const [total, users] = await Promise.all([User.countDocuments(q), User.find(q).sort({ createdAt: -1 }).skip((page-1)*limit).limit(limit)]);
  res.json({ success: true, users, page, pages: Math.ceil(total / limit), total });
});

exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json({ success: true, user });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  if (user.role === 'admin') { res.status(400); throw new Error('Cannot delete admin'); }
  await user.deleteOne();
  res.json({ success: true, message: 'User deleted' });
});

exports.toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  if (user.role === 'admin') { res.status(400); throw new Error('Cannot block admin'); }
  user.isBlocked = !user.isBlocked;
  await user.save();
  res.json({ success: true, isBlocked: user.isBlocked });
});

exports.getUserStats = asyncHandler(async (req, res) => {
  const [total, blocked, newThisMonth] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ isBlocked: true }),
    User.countDocuments({ createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } }),
  ]);
  res.json({ success: true, stats: { total, blocked, newThisMonth } });
});
