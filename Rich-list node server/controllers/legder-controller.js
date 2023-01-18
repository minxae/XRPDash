const xrpledger = require("../xrpLedger/xrpLedgerCaller");
const home = "https://localhost:8080";
const fs = require("fs");
const path = require("path");
const utils = require("../utils");

let allAccounts;
let accountsLoaded = false;
let accountsReadByServer = false;

async function setup(req, res){
    // update all data from the ledger
    // all accounts should be in one array
    res.send("Updating in progress. Call status end-point for updates")
    xrpledger.loadXrpLedgerData();
    accountsLoaded = true;
}

async function getRankByAccount(req, res){
    let address = req.params.address;

    if (allAccounts.length > 0){
        // get rank from accounts array
        res.send({Rank: calculateRank(address)}) 
    } else {
        res.status(400).send({
            message: "Can't determine rank at this point, try again later",
            error: true
        });
    }
    
}

function calculateRank(address){
    allAccounts.sort(utils.sortByNumeric)
    for(i in allAccounts){
        if(allAccounts[i].Account == address){
            return i;
        }
    }
    return "Not found"; 
}

function getTotalAccountsOnLedger(req, res){
    if(allAccounts.length > 0){
        res.send({Amount: allAccounts.length});
    }else {
        res.send({
            message: "Can't determine amount of accounts at this point, try again later",
            error: true
        });
    }
}

function readDataFromFile(filePath){
    try {
        fs.readFile(filePath, "utf8", function(err, data){
            if(err){
                throw err
            }       
            try{
                let accounts = JSON.parse(data);
                if(accounts.length > 0){
                    allAccounts = accounts;
                    console.log("Done reading accounts from file");
                    accountsReadByServer = true;
                }else {
                    console.log("Error in reading accounts data");
                }
            }catch(err){
                console.log(err);
            }
        });
    } catch(err){
        console.log(err);
    }
}

function statusUpdate(req, res){
    if(accountsLoaded && accountsReadByServer){
        res.status(200).send({
            messsage: "Accounts are loaded and read by server and ready to be distributed to users",
            status : true,
            accountsLoaded: allAccounts.length
        })
    }else {
        res.status(400).send({
            messsage: "Accounts are not loaded and read by the server yet, users can not get there rank yet.",
            status : false
        });
    }
}

// Function that start at the start-up ->
//readDataFromFile(path.join(__dirname, "../accounts/accounts.json"));


module.exports = {
    setup,
    statusUpdate,
    getRankByAccount,
    getTotalAccountsOnLedger
};