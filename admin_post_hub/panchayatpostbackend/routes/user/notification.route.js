const express = require("express");
const { notificationController } = require("../../controllers/user");

const router = express.Router();

router.post("/register", notificationController.register);
router.post('/sendnotification', notificationController.sendNotifications)


module.exports = router;
