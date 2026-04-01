const express = require('express');
const r = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { upload, bufferToBase64 } = require('../middleware/uploadMiddleware');

r.post('/', protect, admin, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ success: false, message: 'No files uploaded' });
    const images = req.files.map(f => ({
      url: bufferToBase64(f.buffer, f.mimetype),
      public_id: `${Date.now()}-${f.originalname}`,
    }));
    res.json({ success: true, images });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = r;
