const express = require("express");
const router = express.Router();
const auth = require("./auth.route");
const user = require("./user.route");
const explore = require("./explore.route");
const imageeditor = require("./imageeditor.route");
const appcontrol = require("../admin/appcontrol.route");

const business = require("./business.route");
const category = require("./category.route");
const template = require("./template.route");
const subscription = require("./subscription.route");
const themesample = require("../admin/themesample.route");
const festival = require("./festival.route");
const greetings = require("./greeting.route");
const notification = require("./notification.route");
const verify = require("../../middlewares/verifyToken");
const looseVerify = require("../../middlewares/looseVerifyToken");

// Public mobile app control & preloader configuration endpoints (Flutter / Mobile app integration)
router.use("/app/config", appcontrol);
router.use("/appcontrol", appcontrol);
router.use("/app-config", appcontrol);
router.use("/app/screen-config", appcontrol);
router.use("/config", appcontrol);

router.use("/", auth);
router.use("/user", verify, user);
router.use("/explore", looseVerify, explore);
router.use("/imageeditor", verify, imageeditor);
router.use('/festival', verify, festival)
router.use("/business", verify, business);
router.use("/category", verify, category);
router.use("/template", verify, template);
router.use("/subscriptions", verify, subscription);
router.use("/themesamples", verify, themesample);
router.use("/greetings", verify, greetings);
router.use("/notification", notification);

module.exports = router;
