import * as api from "../api-helper.js"

let allTxHistory;
let txHolder = $(".tx-container");
let holder = sessionStorage.getItem("Address");  

$(function(){
    
});

export async function setData (address){
    appendTxLoader(); // loads in the loader so users know what is happening ->
    let data = await api.getTxInfo(address);
    if (!data.message) {
        allTxHistory = data;
        appendTxHistory();
    } else {

    }
}

// Gets all information from the api and stores it in a local array @allTxHistory ->
async function getTxHistory () {
    
}

// Appends all tx to the users interface ->
async function appendTxHistory () {
    txHolder.empty();
     // Append every createTxItem() to this container ->
    for (let i in allTxHistory) {
        createTxItem(allTxHistory[i]);
    }
}

// TODO: create item based on tx info
function createTxItem (txData) {

    let amount = txData.Amount;
    let currency = "XRP"
    let jan = new Date("01-01-2000");
    let date = jan.getTime() + (txData.date * 1000);

    if (typeof txData.Amount == "object") {
        currency = txData.Amount.currency
        amount = txData.Amount.value
    } 

    if(currency == "XRP"){
        amount = Math.round(parseInt(amount) / 1000000);
    }

    let txItem = $(`<div class="row tx-item align-items-center">
                    <div class="col-md-1">
                        <span><h5 class="lead"><i class="${checkIfIncomeOrExpenses(txData)}"></i></h5></span>
                    </div>
                    <div class="col-md-1">
                        <span><h5 class=""> ${currency}</h5></span>
                    </div>
                    <div class="col-md-3 text-center p-2">
                        <div class="row">
                            <div class="col text-break">
                                ${txData.Account}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <i class="bi bi-three-dots-vertical"></i>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col text-break">
                                ${txData.Destination}
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <p class="text-muted m-0 text-center">${new Date(date).toLocaleDateString()}</p>
                    </div>
                    <div class="col-md-2">
                        <div class="status">
                            <p class="status-text m-0"></i>${txData.TransactionType} <i class="bi bi-check"></i></p>
                        </div>
                    </div>
                    <div class="col-md-3 p-2 text-center">
                        <h5 class="m-0">${amount}</h5>
                    </div>
                </div>`)
    // append here ->

    txItem.on("click", function(){
        $(".m-currency").text(currency);
        $(".m-from").text(txData.Account);
        $(".m-to").text(txData.Destination)
        $(".m-fee").text(txData.Fee);
        $(".m-type").text(txData.TransactionType);
        $(".m-sign-key").text(txData.SigningPubKey);
        $(".m-hash").text(txData.hash);
        $(".m-ledger-index").text(txData.ledger_index);
        $(".m-amount").text(amount);
        $(".m-date").text(new Date(date).toLocaleDateString());
        $(".m-info").find("i").attr("class", checkIfIncomeOrExpenses(txData));

        $("#tx-modal").modal()
    })

    txHolder.append(txItem);

}

//Checks if destination is same as wallet address, if true amount is income ->
function checkIfIncomeOrExpenses(txData){
    return holder == txData.Destination ? "bi bi-arrow-down-circle-fill income" : "bi bi-arrow-up-circle-fill expenses"
}

// Add loader items as a loader for tx history ->
function appendTxLoader () {
    txHolder.empty();
    let loaderItem = `<div class="row tx-item align-items-center">
                        <div class="col-md-2">
                            <div class="tx-loader-item"></div>
                        </div>
                        <div class="col-md-3 text-center p-2">
                            <div class="row">
                                <div class="col">
                                    <div class="tx-loader-item"></div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <i class="bi bi-three-dots-vertical"></i>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <div class="tx-loader-item"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="tx-loader-item"></div>
                        </div>
                        <div class="col-md-2">
                            <div class="tx-loader-item"></div>
                        </div>
                        <div class="col-md-3 p-2 text-center">
                            <div class="tx-loader-item m-2"></div>
                            <div class="tx-loader-item m-2"></div>
                        </div>
                    </div>`

      for (let i = 0; i <= 3; i++) {
        txHolder.append(loaderItem);
      }             

}
