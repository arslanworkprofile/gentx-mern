const express = require('express');
const r = express.Router();
const c = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

r.get('/',              c.getProducts);
r.get('/admin/all',     protect, admin, c.getAdminProducts);
r.get('/:id',           c.getProductById);
r.post('/',             protect, admin, upload.array('images', 10), c.createProduct);
r.put('/:id',           protect, admin, upload.array('images', 10), c.updateProduct);
r.delete('/:id',        protect, admin, c.deleteProduct);
r.post('/:id/reviews',  protect, c.addReview);
r.patch('/:id/toggle',  protect, admin, c.toggleProduct);
module.exports = r;
