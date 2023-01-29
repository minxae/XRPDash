const express = require("express");
const PORT = 8080;
const app = express();
const path = require("path");
const server = require('http').createServer(app)
const bodyParser = require("body-parser");
const middelware = require("./middleware/auth.js")
const cookieParser = require("cookie-parser")
const Websocket = require('ws');
const wss = new Websocket.Server({server:server})

// xrp ledger

const xrpLedger = require("./controllers/legder-controller")

//Firebase
const admin = require("firebase-admin")
const credentials = require(path.join(__dirname, "./serviceAccountKey"))

admin.initializeApp({
    credential : admin.credential.cert(credentials)
})

// All routers ->
const accountRouter = require("./routes/account-route");
const ledgerRouter = require("./routes/ledger-route");
const txRouter = require("./routes/tx-route");
const adminRouter = require("./routes/admin-route");
const { database } = require("firebase-admin");

app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(cookieParser())

// routes ->
app.use("/account", accountRouter);
app.use("/ledger",  ledgerRouter);
app.use("/tx", txRouter);
app.use("/admin",adminRouter)

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
app.get("/admin", middelware.isAdmin, function(req, res){
    res.sendFile(path.join(__dirname, "/public/html/admin-dashboard.html"))
})

wss.on("connection", async function connection(ws){
    console.log("Admin online and connected");
    setInterval( async () => {
        let data = await xrpLedger.statusUpdate();
        ws.send(JSON.stringify(data))
    },1000)
})

server.listen(PORT, () => console.log("SERVER RUNNING"));

