const xrpledger = require("../xrpLedger/xrpLedgerCaller");
const home = "https://localhost:8080";
const fs = require("fs");
const path = require("path");
const utils = require("../utils");

const controller = new AbortController();
const signal = controller.signal

let allAccounts;
let setupCanceled;

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
    resetStatus()
    // update all data from the ledger
    // all accounts should be in one array
    try {
        res.send({
            message : "Starting updating accounts...",
            alertType : "success"
        });
        
        setupStatus.status.t1_loadingAccount = true;
        await xrpledger.loadXrpLedgerData({signal});

        setupStatus.status.t2_writingAccount = true;
        await readDataFromFile(path.join(__dirname, "../accounts/accounts.json"));

        setupStatus.status.t3_done = true;
        
    }catch(e) {
        if(e.name === "AbortError"){
            setupCanceled = true;
            res.send("Canceled setup");
        }
    }
}

async function cancelSetup(req, res){
    if(setupStatus.status.t1_loadingAccount){
        controller.abort();
        resetStatus();
        res.send({
            message : "Setup was canceled.",
            progress  : xrpledger.getPercentage(),
            alertType : "success"
        });
    }else {
        res.send({
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
    return stats.ctime
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
    let percentages = [0.1, 1, 5, 10, 40]
    for(i in percentages){
        let percentage = percentages[i];
        if(balanceExistsInPercentage(percentage, account["Balance"])){
            return percentage
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

function statusUpdate_1(req, res){
    if(accountsLoaded && accountsReadByServer){
        res.status(200).send({
            message: "Accounts are loaded and read by server and ready to be distributed to users",
            status : true,
            accountsLoaded: allAccounts.length
        })
    }else if(startedLoading) {
        res.status(400).send({
            message: "Reading accounts from the XRP ledger...",
            loading : true
        });
    }else {
        res.status(400).send({
            message: "Accounts are not loaded and read by the server yet, users can not get there rank yet.",
            status : false
        });
    }
}
 
// Function that start at the start-up ->


module.exports = {
    setup,
    statusUpdate,
    getRankInfoByAccount,
    getTotalAccountsOnLedger,
    cancelSetup,
    readDataFromFile
};