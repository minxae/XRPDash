import * as api from "../api-helper.js";

// Variables that references to the HTML element ->
let amount;
let account;
const loader = $(`
        <div class='loader'>
            <div class='loader-item'>

            </div>
        </div>`);

$(function() {
    $(".address-card").after(loader);
});
//  > Functions

// Set all data to correct data from the api -> 
export async function setData(address){
    loader.show();
    let data = await api.getAddressInfo(address);
    let rankInfo = await api.getRank(address);
    loader.hide();

    console.log(rankInfo)
    let balance = Math.round(parseInt(data.result.account_data.Balance) / 1000000);
    let accountAddress = data.result.account_data.Account;

    let currentRank = rankInfo.rank_data.curRank;
    let topPercentage = rankInfo.rank_data.topPercentage;
    let amountOfAccounts = rankInfo.rank_data.AmountOfAccounts;

    $("#address").text(accountAddress);
    $("#walletAmount").text("#"+ decimals(currentRank));
    $("#valuta").html("Out of <b class='total-accounts'>" + decimals(amountOfAccounts.toString()) + " </b>accounts.");
    $("#XRP").text(balance);
    $("#percentage").text(topPercentage)
}

function decimals(number){
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// refreshes all data from the per made div ->
$("#refresh-data-btn").on("click", () => {
    // let randomNumber = Math.random();
    // amount.text(randomNumber);
});


