const express = require('express');
const r = express.Router();
const c = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

r.get('/stats',       protect, admin, c.getUserStats);
r.get('/',            protect, admin, c.getAllUsers);
r.get('/:id',         protect, admin, c.getUserById);
r.delete('/:id',      protect, admin, c.deleteUser);
r.patch('/:id/block', protect, admin, c.toggleBlockUser);
module.exports = r;
