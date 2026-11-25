const express = require("express");
const { userController } = require("../../controllers/admin");
const upload = require("../../multer");
const router = express.Router();

router.get("/appusers", userController.appUsers);
router.get("/appusersexcel", userController.appUserExport);

router.get("/appuserInfo", userController.getUserInfo);
router.get("/getUserPin", userController.getUserPin);

router.get("/adminusers", userController.adminUsers);
router.get("/subscribedusers", userController.subscribedUsers);
router.post("/create", userController.create);
router.put("/update", userController.update);
router.delete("/delete", userController.remove);
router.post("/assignsubscription", userController.assignSubscription);
router.post("/deletesubscription", userController.deleteSubscription);
router.post("/addbusiness", upload.any(), userController.addBusiness);
router.post("/addgrampanchayat", upload.any(), userController.addGrampanchayat);
router.post("/addelection", upload.any(), userController.addElection);

module.exports = router;
