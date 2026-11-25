const express = require('express');
const { greetingController } = require('../../controllers/admin')
const upload = require('../../multer/uploadSubcategoryImages')

const router = express.Router();

router.get('/', greetingController.all)
router.post('/create', greetingController.create)
router.put('/update', greetingController.update)
router.post('/uploadimages', upload.any(), greetingController.uploadImages)
router.delete('/delete', greetingController.remove)
router.get('/getimages', greetingController.getImages)

module.exports = router;
