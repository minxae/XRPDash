// This file loads in all available widgets at the start of loading dashboard information ->
import * as widgets from "./widgets.js"; 
import * as apiHelper from "./api-helper.js";
import * as utils from "./utils.js";

let address = sessionStorage.getItem("Address");

$(async function() {
    $(".loader").hide();
    let isValid = await apiHelper.walletCheck(address);
    if(address && isValid){
        widgets.setAllData(address); // Set all dashboard data @param : wallet address out of the session or cookie ->
    } else {
        utils.redirectToPage("login");
    }
});

// Refresh all data on dashboard
$("#w_1").on("click", async function(){
    let isValid = await apiHelper.walletCheck(address);
    if(address && isValid){
        widgets.setAllData(address);
    }else {
        utils.redirectToPage("login");
    }
     // Set all dashboard data @param : wallet address out of the session or cookie ->
});