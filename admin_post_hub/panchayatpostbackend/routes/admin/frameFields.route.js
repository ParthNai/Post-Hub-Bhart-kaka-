const express = require('express');
const { frameFieldsController } = require('../../controllers/admin')
const upload = require('../../multer/uploadFrames')

const router = express.Router();

router.get('/', frameFieldsController.all)
router.post('/create', upload.any(), frameFieldsController.create)
router.put('/update', upload.any(), frameFieldsController.update)
router.get('/delete', frameFieldsController.remove)

module.exports = router;
