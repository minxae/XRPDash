const express = require("express");
const ledgerController = require("../controllers/legder-controller");
const middelware = require("../middleware/auth.js")
const path = require("path")
const router = express.Router();

// TODO: ADD ADMIN MIDDLEWARE IF NOT ADDED!
router.get("/setup", middelware.isAdmin, ledgerController.setup);

router.get("/status", middelware.isAdmin, ledgerController.statusUpdate);

router.get("/cancel", middelware.isAdmin, ledgerController.cancelSetup)

router.get("/login", function(req, res){
    res.sendFile(path.join(__dirname, "../public/html/admin-login.html"))
})

module.exports = router;