const xrpledger = require("../xrpLedger/xrpLedgerCaller");
const home = "https://localhost:8080";
const fs = require("fs");
const path = require("path");
const utils = require("../utils");

let allAccounts;

let setupStatus = {
    status : {
        t1_loadingAccount: false,
        t2_writingAccount: false,
        t3_done: false
    }, 
    progress: {
        percentage: 0,
        amountOfAccountsLoaded: 0
    },
    date : {
        lastUpdated: "23133"
    }
}

async function setup(req, res){
    if(!setupStatus.status.t1_loadingAccount){
        resetStatus();
        
        res.status(200).send({message : "Starting setup..."});
        // update all data from the ledger
        // all accounts should be in one array
        try {
            setupStatus.status.t1_loadingAccount = true;
            await xrpledger.loadXrpLedgerData();
    
            setupStatus.status.t2_writingAccount = true;
            await readDataFromFile(path.join(__dirname, "../accounts/accounts.json"));
    
            setupStatus.status.t3_done = true;

            resetStatus();
        }catch(e) {
            return;
        }
    }else {
        res.status(400).send({message : "Setup function is already running."})
    }
}

async function cancelSetup(req, res){
    if(setupStatus.status.t1_loadingAccount){
        if(xrpledger.getController()){
            let c = xrpledger.getController();
            c.abort();
        }
        resetStatus();
        res.status(200).send({
            message : "Current Setup was canceled.",
            progress  : xrpledger.getPercentage(),
            alertType : "success"
        });
    }else {
        res.status(400).send({
            message : "The setup function is currently not running.",
            alertType : "danger"
        })
    }
}

// Websocket function 
async function statusUpdate(){
    setupStatus.progress.percentage = xrpledger.getPercentage();
    setupStatus.progress.amountOfAccountsLoaded = xrpledger.getLoadedAccounts();

    setupStatus.date.lastUpdated = await getFileDate();

    return setupStatus;
}

function resetStatus(){
    setupStatus.status.t1_loadingAccount = false;
    setupStatus.status.t2_writingAccount = false;
    setupStatus.progress.percentage = 0;
    setupStatus.progress.amountOfAccountsLoaded = 0;
    xrpledger.setPercentage(0);
    xrpledger.setLoadedAccounts(0);
}

async function getFileDate(){
    let stats = await fs.promises.stat(path.join(__dirname, "../accounts/accounts.json"));
    return new Date(stats.ctime);
}

async function getRankInfoByAccount(req, res){
    let address = req.params.address;
    let account = findAccountByAddress(address);
    
    if (allAccounts && allAccounts.length > 0){
        // get rank from accounts array
        res.send({
            rank_data: {
                curRank: account.rank,
                AmountOfAccounts: allAccounts.length,
                topPercentage: calculateTopPercentages(account.account)
            }
        }) 
    } else {
        res.status(400).send({
            message: "Can't determine rank at this point, try again later",
            error: true
        });
    }   
}

function calculateTopPercentages(account){
    let percentages = [0.1, 0.3, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 5, 10, 40]
    for(i in percentages){
        let percentage = percentages[i];
        if(balanceExistsInPercentage(percentage, account["Balance"])){
            return percentage + "%"
        }
    }
    return "Beneath the " + percentages[percentages.length - 1] + "%"
}

function balanceExistsInPercentage(percentage, balance){
    let percentagePos = Math.round((allAccounts.length / 100) * percentage);
    let percentageThreshold = allAccounts[percentagePos]
    if(parseInt(balance) >= parseInt(percentageThreshold["Balance"])){
        return true
    }
}

function findAccountByAddress(address){
    for(i in allAccounts){
        if(allAccounts[i]["Account"] == address){
            return {rank: i, account : allAccounts[i]};
        }
    }
}

function calculateRank(address){
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

async function readDataFromFile(filePath){
    try {
        fs.readFile(filePath, "utf8", function(err, data){
            if(err){
                throw err
            }       
            try{
                let accounts = JSON.parse(data);
                if(accounts.length > 0){
                    allAccounts = accounts;
                    allAccounts.sort(utils.sortByNumeric)
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

module.exports = {
    setup,
    statusUpdate,
    getRankInfoByAccount,
    getTotalAccountsOnLedger,
    cancelSetup,
    readDataFromFile
};