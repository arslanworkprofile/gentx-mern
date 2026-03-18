const multer = require('multer');
const path   = require('path');
const fs     = require('fs');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const useCloudinary = process.env.USE_CLOUDINARY === 'true';

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`),
});

const fileFilter = (req, file, cb) => {
  /\.(jpe?g|png|gif|webp)$/i.test(file.originalname)
    ? cb(null, true)
    : cb(new Error('Images only (jpg, png, gif, webp)'), false);
};

const upload = multer({
  storage: useCloudinary ? multer.memoryStorage() : diskStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const uploadToCloudinary = (buffer, folder = 'gentx') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => err ? reject(err) : resolve({ url: result.secure_url, public_id: result.public_id })
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

const deleteFromCloudinary = (public_id) =>
  public_id ? cloudinary.uploader.destroy(public_id) : Promise.resolve();

module.exports = { upload, uploadToCloudinary, deleteFromCloudinary, useCloudinary };
