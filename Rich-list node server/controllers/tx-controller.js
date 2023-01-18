const xrpledger = require("../xrpLedger/xrpLedgerCaller");

const home = "https://localhost:8080"; 

async function getAllAccountInfo(req, res){
    let accountAddress = req.params.address;
    if(accountAddress){
        try {
            let data = await xrpledger.getTxInformation(accountAddress);
            res.status(200).send(data);
            
        } catch(err){
            console.log(err);
        }
    }else {
        res.status(400);
    }
    
}

module.exports = {
    getAllAccountInfo
};