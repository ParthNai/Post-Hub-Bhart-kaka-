const express = require('express');
const { businessController } = require('../../controllers/admin')
const upload = require('../../multer/uploadBusinessLogo')

const router = express.Router();

router.get('/', businessController.all)
router.post('/create', upload.any(), businessController.create)
router.put('/update', upload.any(), businessController.update)
router.delete('/delete', businessController.remove)

module.exports = router;
