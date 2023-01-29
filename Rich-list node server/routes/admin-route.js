const express = require("express");
const ledgerController = require("../controllers/legder-controller");
const middelware = require("../middleware/auth.js")
const path = require("path")
const router = express.Router();

// TODO: ADD ADMIN MIDDLEWARE IF NOT ADDED!
router.get("/setup", ledgerController.setup);

router.get("/status", ledgerController.statusUpdate);

router.get("/cancel", ledgerController.cancelSetup)

router.get("/login", function(req, res){
    res.sendFile(path.join(__dirname, "../public/html/admin-login.html"))
})

module.exports = router;