const express = require("express");
const accountController = require("../controllers/account-controller");
const router = express.Router();

router.get("/:address", accountController.getAllAccountInfo);

router.get("/check/:address", accountController.isWalletValid)

router.get("/currencies/:address", accountController.getHoldingOfAccount)

module.exports = router;