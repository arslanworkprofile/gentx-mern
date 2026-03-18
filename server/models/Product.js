const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:    { type: String, required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name:          { type: String, required: [true, 'Name required'], trim: true },
  description:   { type: String, required: [true, 'Description required'] },
  price:         { type: Number, required: [true, 'Price required'], min: 0 },
  discountPrice: { type: Number, default: 0 },
  category:      {
    type: String, required: [true, 'Category required'],
    enum: ['shirts', 'pants', 'jackets', 'shoes', 'accessories', 'hoodies', 'suits', 'casual', 'formal', 'other'],
  },
  brand:       { type: String, default: 'Gent X' },
  images:      [{ url: String, public_id: String }],
  colors:      [String],
  sizes:       [String],
  variants:    [{ name: String, value: String }],
  stock:       { type: Number, default: 0, min: 0 },
  sold:        { type: Number, default: 0 },
  reviews:     [reviewSchema],
  rating:      { type: Number, default: 0 },
  numReviews:  { type: Number, default: 0 },
  featured:    { type: Boolean, default: false },
  isNew:       { type: Boolean, default: true },
  tags:        [String],
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

productSchema.methods.updateRating = function () {
  if (!this.reviews.length) { this.rating = 0; this.numReviews = 0; return; }
  this.rating = Math.round((this.reviews.reduce((a, r) => a + r.rating, 0) / this.reviews.length) * 10) / 10;
  this.numReviews = this.reviews.length;
};

module.exports = mongoose.model('Product', productSchema);

