const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const primaryDir = path.join(__dirname, '..', 'uploaded', 'image', 'homeHero');
    const fallbackDir = path.join(process.cwd(), 'uploaded', 'image', 'homeHero');
    [primaryDir, fallbackDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        try { fs.mkdirSync(dir, { recursive: true }); } catch (_) {}
      }
    });
    cb(null, primaryDir);
  },
  filename: function (req, file, cb) {
    const uniqueId = crypto.randomBytes(6).toString('hex');
    cb(
      null,
      'hero_' +
        Date.now() +
        '_' +
        uniqueId +
        path.extname(file.originalname).toLowerCase()
    );
  },
});

module.exports = multer({
  storage,
  limits: { fileSize: 10485760 },
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = ['.png', '.jpg', '.jpeg', '.webp'];
    if (!allowed.includes(ext)) {
      return callback(new Error('Invalid image format. Allowed formats: PNG, JPG, JPEG, WebP'), false);
    }
    callback(null, true);
  },
});
