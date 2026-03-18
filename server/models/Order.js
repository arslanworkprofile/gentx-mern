const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name:     String,
    image:    String,
    price:    { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    color:    String,
    size:     String,
  }],
  shippingAddress: {
    fullName: { type: String, required: true },
    street:   { type: String, required: true },
    city:     { type: String, required: true },
    state:    { type: String, required: true },
    zipCode:  { type: String, required: true },
    country:  { type: String, required: true },
    phone:    { type: String, required: true },
  },
  paymentMethod: { type: String, default: 'card' },
  paymentResult: { id: String, status: String, update_time: String, email_address: String },
  itemsPrice:   { type: Number, required: true, default: 0 },
  shippingPrice:{ type: Number, required: true, default: 0 },
  taxPrice:     { type: Number, required: true, default: 0 },
  totalPrice:   { type: Number, required: true, default: 0 },
  isPaid:       { type: Boolean, default: false },
  paidAt:       Date,
  orderStatus:  { type: String, enum: ['pending','processing','shipped','delivered','cancelled'], default: 'pending' },
  deliveredAt:  Date,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
