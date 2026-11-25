const express = require('express');
const { categoryController } = require('../../controllers/user')

const router = express.Router();

router.get('/', categoryController.all)
router.get('/subcategory', categoryController.getSubcategory)

module.exports = router;
