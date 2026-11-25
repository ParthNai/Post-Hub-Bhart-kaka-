const express = require('express');
const { subscriptionController } = require('../../controllers/admin')

const router = express.Router();

router.get('/', subscriptionController.all)
router.post('/create', subscriptionController.create)
router.put('/update', subscriptionController.update)
router.delete('/delete', subscriptionController.remove)

module.exports = router;
