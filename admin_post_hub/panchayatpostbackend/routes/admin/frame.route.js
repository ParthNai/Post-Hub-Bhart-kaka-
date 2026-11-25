const express = require('express');
const { frameController } = require('../../controllers/admin')
const upload = require('../../multer/uploadFrames')

const router = express.Router();

router.get('/', frameController.all)
router.post('/uploadframe', upload.any(), frameController.uploadframe)
router.post('/create', frameController.create)
router.put('/update', frameController.update)
router.get('/delete', frameController.remove)

module.exports = router;
