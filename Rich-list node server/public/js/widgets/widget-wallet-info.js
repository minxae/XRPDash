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
    let rankData = await api.getRank(address);
    loader.hide();

    let balance;
    let accountAddress;
    let currentRank = rankData.Rank;

    if(data.result.status == "success"){
         console.log(data.result.account_data.Balance);
         balance = parseInt(data.result.account_data.Balance) / 1000000;
         accountAddress = data.result.account_data.Account;

         $("#address").text(accountAddress);
         $("#walletAmount").text("#"+ decimals(currentRank));
         $("#valuta").text( Math.round(balance) + " XRP");
    }
}

function decimals(number){
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

decimals("3453466");
// refreshes all data from the per made div ->
$("#refresh-data-btn").on("click", () => {
    // let randomNumber = Math.random();
    // amount.text(randomNumber);
});


