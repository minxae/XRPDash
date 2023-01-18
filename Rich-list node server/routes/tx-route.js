const express = require("express");
const txController = require("../controllers/tx-controller");
const router = express.Router();

router.get("/:address", txController.getAllAccountInfo)

module.exports = router;