const express = require('express');
const r = express.Router();
const c = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// Public
r.get('/', c.getSettings);

// Admin — general
r.put('/general', protect, admin, c.updateGeneral);

// Admin — hero slides
r.post(  '/hero',            protect, admin, upload.single('image'), c.addHeroSlide);
r.put(   '/hero/:slideId',   protect, admin, upload.single('image'), c.updateHeroSlide);
r.delete('/hero/:slideId',   protect, admin, c.deleteHeroSlide);

// Admin — categories
r.post(  '/categories',        protect, admin, upload.single('image'), c.addCategory);
r.put(   '/categories/:catId', protect, admin, upload.single('image'), c.updateCategory);
r.delete('/categories/:catId', protect, admin, c.deleteCategory);

module.exports = r;
