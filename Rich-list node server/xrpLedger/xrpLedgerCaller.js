const axios = require("axios").default;
const MongoClient = require('mongodb').MongoClient;
const utils = require("../utils");
const fs = require("fs");
const path = require("path");
const rippleBinary = require("ripple-binary-codec");

const baseUrl = "https://s2.ripple.com:51234/";

let percentage;
let loadedAccounts;

// THIS PROCESS WILL TAKE A LONG TIME DONT CALL THIS FUNCTION AT ANY MOMENT!!! ->
const loadXrpLedgerData = async ({signal}) => {
    let totalAccountsOnLedger = 4300000;
    let ALLACCOUNTS = [];

    let marker;
    let data = {
        "method": "ledger_data",
        "params": [
            {
                "ledger_index": "current",
                "type": "account",
                "binary": true
            }
        ]
    }
    
    do {
        let response = await axios.post(baseUrl, data, {signal});

        let accountArray = response.data.result.state;
        for(i in accountArray){
            let data = rippleBinary.decode(accountArray[i].data);
            let account = data.Account;
            let balance = data.Balance;
            
            ALLACCOUNTS.push({
                Account : account,
                Balance : balance
            });
        }

        marker = response.data["result"]["marker"]; //set marker to new marker
        data.params[0].marker = marker; // set marker in data object for next call
        
        percentage = Math.round((ALLACCOUNTS.length * 100) / totalAccountsOnLedger);
        loadedAccounts = ALLACCOUNTS.length

    } while(marker)

    //sort array by balance
    console.log("Sorting array")
    ALLACCOUNTS.sort(utils.sortByNumeric); 

    //Write data to accounts.json file
    console.log("Writing data to file....")
    try {
        writeArrayToFile(ALLACCOUNTS);
    } catch(err) {
        console.log(err);
    }

    console.log("done");
}

function getPercentage(){
    return percentage;
}

function getLoadedAccounts(){
    return loadedAccounts;
}

function cancelSetup() {
    console.log("ABORTING")
    controller.abort();
}

async function fileHasData(filePath){
    try {
        let stats = await fs.statSync(filePath);
        let size = stats.size;
        if(size > 0){
            return true;
        }else {
            return false;
        }
    }catch(err) {
        console.log(err);
    }
}

async function fileExists(filePath){
    try {
        fs.open(filePath, function(err){
            if(err){
                return true;
            } else { 
                return false;
            }
        });
    }catch(err) {
        console.log(err);
    }
}

async function writeArrayToFile(array){
    const accountFilePath = path.join(__dirname, "../accounts/accounts.json");
    let exists = await fileExists(accountFilePath);
    let hasData =  await fileHasData(accountFilePath);
    
    if(exists && hasData) {
        fs.truncate(accountFilePath,0, function(){
            fs.appendFileSync(accountFilePath, JSON.stringify(array),function(err){
                if(err){
                   throw err;
                }
    
            });
        })
    }else {
        fs.writeFileSync(accountFilePath, function(err){
            if(err){
                throw err;
            }
            fs.appendFileSync(accountFilePath, JSON.stringify(array),function(err){
                if(err){
                   throw err;
                }
    
            });
        });
        
    } 
}

const getAccountInformation = async (address) =>{
    
    let data = {
        "method": "account_info",
        "params": [
            {
                "account": address,
                "strict": true,
                "ledger_index": "current",
                "queue": true
            }
        ]
    }
    
    try {
        let response = await axios.post(baseUrl, data);

        if (response.status == 200){
            return response.data;
        } else {
            return {message: "Could not get account information"}
        }
        
    } catch(err) {
        console.log(err);
    }
}

// Get all transaction history based on transactionType : "Payment"
async function getTxInformation(address){

    let txHistory = [];
    let marker;

    let data = {
        "method": "account_tx",
        "params": [
            {
                "account": address,
                "binary": false,
                "forward": false,
                "ledger_index_max": -1,
                "ledger_index_min": -1
            }
        ]
    }
    do {
        try {
            let response = await axios.post(baseUrl, data);
            let result = response.data.result;
            if (response.status == 200){
                if (!result.error_message){
                    if (result.marker){    
                        for (i in result.transactions){
                            transaction = result.transactions[i].tx
                            if (transaction.TransactionType == "Payment"){
                                txHistory.push(transaction);
                            }
                        }
                       marker = result.marker;
                       data.params[0].marker = marker;
                    } else {
                        for (index in result.transactions){
                            transaction = result.transactions[index].tx
                            if (transaction.TransactionType == "Payment"){
                                txHistory.push(transaction);
                            }
                        }
                        marker = undefined;
                    }
                } else {
                    return {message: "Could not get wallet address"};
                }
            } else {
             return {message: "Could not get transaction history"}
            }
        } catch(err) {
            return {message: err}
        }
        
    } while (marker);

    return txHistory;
}

// Gets all holdings by an account excl XRP
async function getCurrencies(address){

    let data = {
        "method": "account_currencies",
        "params": [
            {
                "account": address,
                "ledger_index" : "validated",
                "strict" : true
            }
        ]
    }
    let currencies = []
    try {
        let response = await axios.post(baseUrl, data);
        let result = response.data.result;  
        if (response.status == 200){
            if (!result.error_message){
                if (result.receive_currencies.length >= 1){
                    for (i in result.receive_currencies){
                        let currency = result.receive_currencies[i];
                        if (currency.length > 5){
                            currencies.push(getCurrenciesName(currency));
                        } else {
                            currencies.push(currency);
                        }
                    }
                } else {
                    return {message : "No currencies found"};
                }
                return {data : currencies};
            } else {
                return {message : "Wallet address not found"}
            }
        } else {
            return{message : "Could not get currencies"};
        }
    
    } catch(err){
        console.log(err)
        return err;
    }

}

function getCurrenciesName(currencyString){
    switch(currencyString)
    {
        case "534F4C4F00000000000000000000000000000000":
            return "SOLO"

        case "4368656574616800000000000000000000000000":
            return "CHTA"

        case "4254435800000000000000000000000000000000":
            return "BTCX"

    }

    return "unknown"
}

module.exports = {
    loadXrpLedgerData,
    getAccountInformation,
    getTxInformation,
    getCurrencies,
    cancelSetup,
    getLoadedAccounts,
    getPercentage
};

