const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// @GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, min, max, page = 1, limit = 12, featured, newArrival, bestSeller } = req.query;
    const query = {};

    if (category) query.category = category;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
    if (min || max) query.price = { ...(min && { $gte: Number(min) }), ...(max && { $lte: Number(max) }) };
    if (featured === 'true') query.isFeatured = true;
    if (newArrival === 'true') query.isNewArrival = true;
    if (bestSeller === 'true') query.isBestSeller = true;

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating: { rating: -1 },
    };
    const sortBy = sortOptions[sort] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortBy).skip(skip).limit(Number(limit));

    res.json({
      products,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/products (admin)
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @PUT /api/products/:id (admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @DELETE /api/products/:id (admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/products/:id/reviews
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) return res.status(400).json({ message: 'Product already reviewed' });

    product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
    product.updateRating();
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
