const express = require("express");
const { auth } = require("../../controllers/user");
const verify = require("../../middlewares/verifyToken");
const validate = require("../../middlewares/validate");
const { authValidation } = require("../../validations");

const router = express.Router();

const delay = (req, res, next) => {
  setTimeout(() => {
    next();
  }, 3000);
};
router.post("/checkexistinguser", auth.checkIfUserExist);

router.post("/register", validate(authValidation.register), auth.register);

router.post("/login", validate(authValidation.pinLogin), auth.login);
router.post(
  "/socialLogin",
  validate(authValidation.sendloginotp),
  auth.socialLogin
);
router.get("/details", verify, auth.details);
router.post("/forgotPassword", auth.forgotPassword);
router.post("/checkOtp", auth.checkOtp);
router.post("/sendloginotp", auth.sendloginotp);
router.post("/changeForgotPassword", auth.changeForgotPassword);

module.exports = router;
