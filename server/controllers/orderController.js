const asyncHandler = require('express-async-handler');
const Order   = require('../models/Order');
const Product = require('../models/Product');

// POST /api/orders
exports.createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;
  if (!orderItems?.length) { res.status(400); throw new Error('No order items'); }
  for (const item of orderItems) {
    const p = await Product.findById(item.product);
    if (!p) { res.status(404); throw new Error(`Product not found: ${item.product}`); }
    if (p.stock < item.quantity) { res.status(400); throw new Error(`Insufficient stock for ${p.name}`); }
  }
  const order = await Order.create({
    user: req.user._id, orderItems, shippingAddress, paymentMethod,
    itemsPrice, shippingPrice, taxPrice, totalPrice,
    isPaid: true,
    paidAt: new Date(),
    paymentResult: { id: `PAY-${Date.now()}`, status: 'COMPLETED', update_time: new Date().toISOString(), email_address: req.user.email },
    orderStatus: 'processing',
  });
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, sold: item.quantity } });
  }
  res.status(201).json({ success: true, order });
});

// GET /api/orders/myorders
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// GET /api/orders/:id
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  res.json({ success: true, order });
});

// PUT /api/orders/:id/pay
exports.payOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  order.isPaid = true; order.paidAt = Date.now(); order.orderStatus = 'processing';
  order.paymentResult = { id: `PAY-${Date.now()}`, status: 'COMPLETED', update_time: new Date().toISOString(), email_address: req.user.email };
  const updated = await order.save();
  res.json({ success: true, order: updated });
});

// GET /api/orders (admin)
exports.getAllOrders = asyncHandler(async (req, res) => {
  const page  = +req.query.page  || 1;
  const limit = +req.query.limit || 20;
  const q = {};
  if (req.query.status) q.orderStatus = req.query.status;
  const [total, orders] = await Promise.all([
    Order.countDocuments(q),
    Order.find(q).populate('user', 'name email').sort({ createdAt: -1 }).skip((page-1)*limit).limit(limit),
  ]);
  res.json({ success: true, orders, page, pages: Math.ceil(total / limit), total });
});

// PUT /api/orders/:id/status (admin)
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  const valid = ['pending','processing','shipped','delivered','cancelled'];
  if (!valid.includes(status)) { res.status(400); throw new Error('Invalid status'); }
  order.orderStatus = status;
  if (status === 'delivered') order.deliveredAt = Date.now();
  if (status === 'cancelled') {
    for (const item of order.orderItems)
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity, sold: -item.quantity } });
  }
  const updated = await order.save();
  res.json({ success: true, order: updated });
});

// DELETE /api/orders/:id (admin)
exports.deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  await order.deleteOne();
  res.json({ success: true, message: 'Order deleted' });
});

// GET /api/orders/stats (admin)
exports.getOrderStats = asyncHandler(async (req, res) => {
  const [totalOrders, revenueAgg, statusAgg, recentOrders, monthlyAgg] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]),
    Order.find().populate('user', 'name').sort({ createdAt: -1 }).limit(5),
    Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: new Date(Date.now() - 180*24*60*60*1000) } } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
  ]);
  res.json({ success: true, stats: { totalOrders, totalRevenue: revenueAgg[0]?.total || 0, statusAgg, recentOrders, monthlyAgg } });
});
