const express = require('express');
const { subcategoryController } = require('../../controllers/admin')
const upload = require('../../multer/uploadSubcategoryImages')

const router = express.Router();

router.get('/', subcategoryController.all)
router.post('/create', subcategoryController.create)
router.put('/update', subcategoryController.update)
router.post('/uploadimages', upload.any(), subcategoryController.uploadImages)
router.delete('/delete', subcategoryController.remove)
router.get('/getimages', subcategoryController.getImages)
router.post('/notify', subcategoryController.notify)


module.exports = router;
