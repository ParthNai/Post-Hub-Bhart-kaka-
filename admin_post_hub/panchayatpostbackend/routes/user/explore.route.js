const express = require('express');
const { exploreController } = require('../../controllers/user')

const router = express.Router();

router.get('/', exploreController.all)

module.exports = router;
