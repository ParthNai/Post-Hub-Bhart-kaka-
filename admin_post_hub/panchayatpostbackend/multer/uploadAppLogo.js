const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '..', 'uploaded', 'image', 'appLogo');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const safeExt = path.extname(file.originalname).toLowerCase();
    cb(null, 'app_logo_' + Date.now() + safeExt);
  },
});

const upload = multer({
  storage: storage,
  preservePath: true,
  limits: { fileSize: 10485760 }, // 10MB max limit
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.ico'];
    if (!allowed.includes(ext)) {
      req.fileValidationError = 'Invalid image format. Allowed formats: PNG, JPG, JPEG, SVG, WebP, GIF, ICO';
      return callback(new Error('Invalid image format. Allowed formats: PNG, JPG, JPEG, SVG, WebP, GIF, ICO'), false);
    }
    callback(null, true);
  },
});

module.exports = upload;
