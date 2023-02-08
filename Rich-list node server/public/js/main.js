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
    if(address){
        widgets.setAllData(address);
    }
     // Set all dashboard data @param : wallet address out of the session or cookie ->
});

$(".logout").on("click", function(){
    if(address){
        sessionStorage.setItem("Address", "")
        utils.redirectToPage("login")
    }
})
