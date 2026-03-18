const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { uploadToCloudinary, deleteFromCloudinary, useCloudinary } = require('../middleware/uploadMiddleware');

const parseJSON = (val, fallback = []) => { try { return JSON.parse(val); } catch { return fallback; } };

// GET /api/products
exports.getProducts = asyncHandler(async (req, res) => {
  const page  = +req.query.page  || 1;
  const limit = +req.query.limit || 12;
  const skip  = (page - 1) * limit;
  const q = { isActive: true };
  if (req.query.search)   q.$text     = { $search: req.query.search };
  if (req.query.category) q.category  = req.query.category;
  if (req.query.color)    q.colors    = { $in: [req.query.color] };
  if (req.query.size)     q.sizes     = { $in: [req.query.size] };
  if (req.query.featured === 'true') q.featured = true;
  if (req.query.isNew    === 'true') q.isNew    = true;
  if (req.query.minPrice || req.query.maxPrice) {
    q.price = {};
    if (req.query.minPrice) q.price.$gte = +req.query.minPrice;
    if (req.query.maxPrice) q.price.$lte = +req.query.maxPrice;
  }
  const sortMap = { price_asc: { price: 1 }, price_desc: { price: -1 }, rating: { rating: -1 }, popular: { sold: -1 }, newest: { createdAt: -1 } };
  const sort = sortMap[req.query.sort] || { createdAt: -1 };
  const [total, products] = await Promise.all([
    Product.countDocuments(q),
    Product.find(q).sort(sort).skip(skip).limit(limit),
  ]);
  res.json({ success: true, products, page, pages: Math.ceil(total / limit), total });
});

// GET /api/products/admin/all
exports.getAdminProducts = asyncHandler(async (req, res) => {
  const page  = +req.query.page  || 1;
  const limit = +req.query.limit || 20;
  const q = {};
  if (req.query.search) q.$text = { $search: req.query.search };
  const [total, products] = await Promise.all([
    Product.countDocuments(q),
    Product.find(q).sort({ createdAt: -1 }).skip((page-1)*limit).limit(limit),
  ]);
  res.json({ success: true, products, page, pages: Math.ceil(total / limit), total });
});

// GET /api/products/:id
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
  if (!product || !product.isActive) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, product });
});

// POST /api/products
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, discountPrice, category, brand, colors, sizes, variants, stock, featured, isNew, tags } = req.body;
  if (!name || !description || !price || !category) { res.status(400); throw new Error('Name, description, price, category required'); }
  let images = [];
  if (req.files?.length) {
    if (useCloudinary) {
      for (const f of req.files) images.push(await uploadToCloudinary(f.buffer, 'gentx/products'));
    } else {
      images = req.files.map(f => ({ url: `/uploads/${f.filename}`, public_id: f.filename }));
    }
  }
  const product = await Product.create({
    name, description, price: +price, discountPrice: discountPrice ? +discountPrice : 0,
    category, brand: brand || 'Gent X', images,
    colors: parseJSON(colors), sizes: parseJSON(sizes),
    variants: parseJSON(variants), stock: +stock || 0,
    featured: featured === 'true', isNew: isNew !== 'false',
    tags: parseJSON(tags),
  });
  res.status(201).json({ success: true, product });
});

// PUT /api/products/:id
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  const fields = ['name','description','category','brand','stock','featured','isNew'];
  fields.forEach(f => { if (req.body[f] !== undefined) product[f] = req.body[f]; });
  if (req.body.price)         product.price         = +req.body.price;
  if (req.body.discountPrice !== undefined) product.discountPrice = +req.body.discountPrice;
  if (req.body.colors)   product.colors   = parseJSON(req.body.colors);
  if (req.body.sizes)    product.sizes    = parseJSON(req.body.sizes);
  if (req.body.variants) product.variants = parseJSON(req.body.variants);
  if (req.body.tags)     product.tags     = parseJSON(req.body.tags);
  if (req.body.removeImages) {
    for (const pid of parseJSON(req.body.removeImages)) {
      if (useCloudinary) await deleteFromCloudinary(pid);
      product.images = product.images.filter(i => i.public_id !== pid);
    }
  }
  if (req.files?.length) {
    if (useCloudinary) {
      for (const f of req.files) product.images.push(await uploadToCloudinary(f.buffer, 'gentx/products'));
    } else {
      req.files.forEach(f => product.images.push({ url: `/uploads/${f.filename}`, public_id: f.filename }));
    }
  }
  const updated = await product.save();
  res.json({ success: true, product: updated });
});

// DELETE /api/products/:id
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  if (useCloudinary) for (const img of product.images) await deleteFromCloudinary(img.public_id);
  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted' });
});

// POST /api/products/:id/reviews
exports.addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  if (product.reviews.find(r => r.user.toString() === req.user._id.toString())) {
    res.status(400); throw new Error('Already reviewed');
  }
  product.reviews.push({ user: req.user._id, name: req.user.name, rating: +rating, comment });
  product.updateRating();
  await product.save();
  res.status(201).json({ success: true, message: 'Review added' });
});

// PATCH /api/products/:id/toggle
exports.toggleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  product.isActive = !product.isActive;
  await product.save();
  res.json({ success: true, isActive: product.isActive });
});
