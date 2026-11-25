const express = require('express');
const dashboard = require('../../controllers/admin/dashboard.controller')

const router = express.Router();


router.get('/', dashboard.index)

module.exports = router;
