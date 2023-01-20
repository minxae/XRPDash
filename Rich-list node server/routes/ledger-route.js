const express = require("express");
const ledgerController = require("../controllers/legder-controller");
const router = express.Router();
const middleware = require("../middleware/auth");

//Admin routes
router.post("/setup", ledgerController.setup);
router.post("/status", ledgerController.statusUpdate);

//User routes
router.get("/amountOfAccounts", ledgerController.getTotalAccountsOnLedger);
router.get("/getRank/:address", ledgerController.getRankByAccount);

module.exports = router;