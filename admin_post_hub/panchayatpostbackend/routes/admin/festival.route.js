const express = require('express');
const { festivalController } = require('../../controllers/admin')
const upload = require('../../multer/uploadFestivalImages')

const router = express.Router();

router.get('/', festivalController.all)
router.post('/create', upload.any(), festivalController.create)
router.put('/update', upload.any(), festivalController.update)
router.delete('/delete', festivalController.remove)
router.post('/notify', festivalController.notify)

module.exports = router;
