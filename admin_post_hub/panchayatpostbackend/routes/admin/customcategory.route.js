const express = require('express');
const { customcategoryController } = require('../../controllers/admin')
const upload = require('../../multer/uploadCustomcategoryImages')

const router = express.Router();

router.get('/', customcategoryController.all)
router.post('/create', customcategoryController.create)
router.put('/update', customcategoryController.update)
router.post('/uploadimages', upload.any(), customcategoryController.uploadImages)
router.delete('/delete', customcategoryController.remove)
router.get('/getimages', customcategoryController.getImages)
router.post('/notify', customcategoryController.notify)


module.exports = router;
