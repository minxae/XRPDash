const express = require("express");
const PORT = 8080;
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

//Firebase
const admin = require("firebase-admin")
const credentials = require(path.join(__dirname, "./serviceAccountKey"))

// All routers ->
const accountRouter = require("./routes/account-route");
const ledgerRouter = require("./routes/ledger-route");
const txRouter = require("./routes/tx-route");
const entryRouter = require("./routes/entry-route.js")

//Firebase admin initialize ->
admin.initializeApp({
    credential : admin.credential.cert(credentials)
})

app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());

// routes ->
app.use("/account", accountRouter);
app.use("/ledger",  ledgerRouter);
app.use("/tx", txRouter);
app.use("/entry", entryRouter)


app.get("/dashboard", function(req, res){
    res.sendFile(path.join(__dirname, "/public/html/index.html"));
})
app.get("/ledger", function(req, res){
    res.sendFile(path.join(__dirname, "/public/html/ledger.html"));
})
app.get("/charts", function(req, res){
    res.sendFile(path.join(__dirname, "/public/html/charts.html"));
})
app.get("/contact", function(req, res){
    res.sendFile(path.join(__dirname, "/public/html/contact.html"));
})
app.get("/login", function(req, res){
    res.sendFile(path.join(__dirname, "/public/html/login.html"));
})
app.get("/admin/login", function(req, res){
    res.sendFile(path.join(__dirname, "/public/html/adminLogin.html"))
})

app.listen(PORT, () => console.log("SERVER RUNNING"));

