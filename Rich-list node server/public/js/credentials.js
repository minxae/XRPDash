import * as apiHelper from "./api-helper.js";
import * as utils from "./utils.js";
let alert = $(".alert");
$(function(){
    alert.hide();
});

$(".searchAddress").on("click", async function(){
    let walletAddress = $(".address").val();
    if (walletAddress != "") {
        let data = await apiHelper.walletCheck(walletAddress);// Returns TRUE if address is found, otherwise returns FALSE ->
        if (data) {
            $(".credentials").addClass("slide-out-top");
            sessionStorage.setItem("Address", walletAddress);
            setTimeout(function(){
                window.location = "https://87b8-94-213-95-72.eu.ngrok.io/dashboard"
            }, 1000)
        } else {
            // show error message that users wallet address is invalid
            alert.show();
            alert.removeClass("alert-warning");
            alert.addClass("alert-danger");
            alert.text("Wallet address was not found, perhaps a typo?");
        }

    } else {
        // show error message that users HAS to fill in the wallet address field 
        alert.show();
        alert.removeClass("alert-danger");
        alert.addClass("alert-warning");
        alert.text("Please fill in your wallet address");
    }
    
});
