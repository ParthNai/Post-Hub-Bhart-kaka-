const express = require('express');
const { sliderController } = require('../../controllers/admin')
const upload = require('../../multer')

const router = express.Router();

router.get('/', sliderController.all)
router.post('/create', upload.any(), sliderController.create)
router.put('/update', upload.any(), sliderController.update)
router.delete('/delete', sliderController.remove)

module.exports = router;
