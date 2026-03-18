// routes/orderRoutes.js
const express = require('express');
const r = express.Router();
const c = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

r.get('/stats',       protect, admin, c.getOrderStats);
r.get('/myorders',    protect, c.getMyOrders);
r.get('/',            protect, admin, c.getAllOrders);
r.post('/',           protect, c.createOrder);
r.get('/:id',         protect, c.getOrderById);
r.put('/:id/pay',     protect, c.payOrder);
r.put('/:id/status',  protect, admin, c.updateOrderStatus);
r.delete('/:id',      protect, admin, c.deleteOrder);
module.exports = r;
