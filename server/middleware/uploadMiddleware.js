const multer = require('multer');

// Always use memory storage — we store images as base64 in MongoDB
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    /\.(jpe?g|png|gif|webp)$/i.test(file.originalname)
      ? cb(null, true)
      : cb(new Error('Images only (jpg, png, gif, webp)'), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Convert buffer to base64 data URL — stored directly in MongoDB
const bufferToBase64 = (buffer, mimetype) => {
  const base64 = buffer.toString('base64');
  return `data:${mimetype};base64,${base64}`;
};

module.exports = { upload, bufferToBase64 };
