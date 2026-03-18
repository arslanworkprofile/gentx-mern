// routes/authRoutes.js
const express = require('express');
const r = express.Router();
const c = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
r.post('/register', c.register);
r.post('/login',    c.login);
r.get('/me',        protect, c.getMe);
r.put('/profile',   protect, c.updateProfile);
module.exports = r;
