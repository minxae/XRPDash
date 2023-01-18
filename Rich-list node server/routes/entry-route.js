const express = require("express");
const { app } = require("firebase-admin");
const entryController = require("../controllers/entry-controller");
const router = express.Router();
const middleware = require("../middleware/auth");

router.post("/login", entryController.login)
router.post("/signup", entryController.signUp)

module.exports = router