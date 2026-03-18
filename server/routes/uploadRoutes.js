const express = require('express');
const r = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { upload, uploadToCloudinary, useCloudinary } = require('../middleware/uploadMiddleware');

r.post('/', protect, admin, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ success: false, message: 'No files uploaded' });
    let images = [];
    if (useCloudinary) {
      for (const f of req.files) images.push(await uploadToCloudinary(f.buffer, 'gentx'));
    } else {
      images = req.files.map(f => ({ url: `/uploads/${f.filename}`, public_id: f.filename }));
    }
    res.json({ success: true, images });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = r;
