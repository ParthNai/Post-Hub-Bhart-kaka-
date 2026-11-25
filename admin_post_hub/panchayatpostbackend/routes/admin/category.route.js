const express = require('express');
const { categoryController } = require('../../controllers/admin')

const router = express.Router();

router.get('/', categoryController.all)
router.post('/create', categoryController.create)
router.put('/update', categoryController.update)
router.delete('/delete', categoryController.remove)

module.exports = router;
