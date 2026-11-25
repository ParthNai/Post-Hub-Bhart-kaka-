const express = require('express');
const { grettingController } = require('../../controllers/user')

const router = express.Router();

router.get('/', grettingController.all)

module.exports = router;
