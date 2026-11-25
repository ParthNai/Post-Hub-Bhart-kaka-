const express = require('express');
const { businessController } = require('../../controllers/user')
const upload = require('../../multer/uploadBusinessLogo')

const router = express.Router();

router.get('/all', businessController.all)
router.post('/activate', businessController.activate)
router.post('/', businessController.getSingleBusiness)
router.post('/uploadlogo', upload.any(), businessController.uploadLogo)

module.exports = router;
