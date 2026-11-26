const express = require('express');
const { festivalController } = require('../../controllers/user')

const router = express.Router();

router.get('/all', festivalController.all)
router.get('/check/:id', festivalController.checkAccess)

module.exports = router;
