const express = require("express");
const ledgerController = require("../controllers/legder-controller");
const router = express.Router();

//User routes
router.get("/amountOfAccounts", ledgerController.getTotalAccountsOnLedger);
router.get("/rankInfo/:address", ledgerController.getRankInfoByAccount);

module.exports = router;