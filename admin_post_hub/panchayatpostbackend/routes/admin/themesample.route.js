const express = require('express');
const { themeSampleController } = require('../../controllers/admin')
const upload = require('../../multer')

const router = express.Router();

router.get('/', themeSampleController.all)
router.post('/create', upload.any(), themeSampleController.create)
router.put('/update', upload.any(), themeSampleController.update)
router.delete('/delete', themeSampleController.remove)

module.exports = router;
