const express = require('express');
const { subscriptionController } = require('../../controllers/user')
const verify = require('../../middlewares/verifyToken');

const router = express.Router();

router.get('/all', subscriptionController.all)
router.post('/initiateorder', subscriptionController.createOrder)
router.post('/purchase', verify, subscriptionController.purchase)

module.exports = router;
