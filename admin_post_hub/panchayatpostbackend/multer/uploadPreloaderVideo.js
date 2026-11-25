const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join('uploaded', 'video', 'preloader');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const safeExt = path.extname(file.originalname).toLowerCase();
    cb(null, 'preloader_' + Date.now() + safeExt);
  },
});

const upload = multer({
  storage: storage,
  preservePath: true,
  limits: { fileSize: 52428800 }, // 50MB max limit
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = ['.mp4', '.webm', '.mov', '.mkv'];
    if (!allowed.includes(ext)) {
      req.fileValidationError = 'Invalid video format. Allowed formats: mp4, webm, mov, mkv';
      return callback(new Error('Invalid video format. Allowed formats: mp4, webm, mov, mkv'), false);
    }
    callback(null, true);
  },
});

module.exports = upload;
