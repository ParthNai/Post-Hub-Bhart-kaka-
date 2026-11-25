const express = require('express');
const { templateController } = require('../../controllers/user')

const router = express.Router();

router.get('/', templateController.all)

module.exports = router;
