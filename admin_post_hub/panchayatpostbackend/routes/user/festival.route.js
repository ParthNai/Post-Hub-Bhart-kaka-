const express = require('express');
const { festivalController } = require('../../controllers/user')

const router = express.Router();

router.get('/all', festivalController.all)

module.exports = router;
