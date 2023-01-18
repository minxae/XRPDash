const express = require("express");
const ledgerController = require("../controllers/legder-controller");
const router = express.Router();
const middleware = require("../middleware/auth");

//Admin routes
router.post("/setup", middleware.checkCredentials, ledgerController.setup);
router.post("/status", middleware.checkCredentials, ledgerController.statusUpdate);

//User routes
router.get("/amountOfAccounts", ledgerController.getTotalAccountsOnLedger);
router.get("/getRank/:address", ledgerController.getRankByAccount);

module.exports = router;