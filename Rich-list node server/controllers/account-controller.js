const xrpledger = require("../xrpLedger/xrpLedgerCaller");

const home = "https://localhost:8080"; 

async function getAllAccountInfo(req, res){
    let accountAddress = req.params.address;
    if(accountAddress){
        try {
            let data = await xrpledger.getAccountInformation(accountAddress);
            res.status(200).send(data);
            
        } catch(err){
            console.log(err);
        }
    }else {
        res.status(400).send({message: "No wallet address given to check on the ledger"});
    }
    
}

async function isWalletValid(req, res){
    let accountAddress = req.params.address;

    if(accountAddress){
        try {
            let data = await xrpledger.getAccountInformation(accountAddress);
            if(!data.result.error){
                res.status(200).send({valid:  true});
            } else {
                res.status(400).send({valid: false});
            }
        } catch(err) {
            console.log(err)
        }
    }else {
        res.status(400).send({message: "No wallet address given to check on the ledger"})
    }
}

async function getHoldingOfAccount(req, res){
    let accountAddress = req.params.address;
    if(accountAddress){
        try {
            let data = await xrpledger.getCurrencies(accountAddress);
            res.status(200).send(data);
        } catch(err) {
            console.log(err)
        }
    }else {
        res.status(400).send({message: "No wallet address given to check on the ledger"})
    }
}

module.exports = {
    getAllAccountInfo,
    isWalletValid,
    getHoldingOfAccount
};