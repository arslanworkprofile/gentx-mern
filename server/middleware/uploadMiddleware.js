const multer = require('multer');
const sharp = require('sharp');

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

// Compress + resize image, then convert to base64 data URL
// Keeps images well under MongoDB's 16MB document limit
const bufferToBase64 = async (buffer, mimetype) => {
  try {
    const compressed = await sharp(buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 75 })
      .toBuffer();
    const base64 = compressed.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch {
    // Fallback: encode as-is if sharp fails
    const base64 = buffer.toString('base64');
    return `data:${mimetype};base64,${base64}`;
  }
};

module.exports = { upload, bufferToBase64 };
