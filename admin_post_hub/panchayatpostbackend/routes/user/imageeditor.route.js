const express = require("express");
const { imageEditorController } = require("../../controllers/user");

const router = express.Router();

router.get("/", imageEditorController.all);

module.exports = router;
