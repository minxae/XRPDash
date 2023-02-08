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
                window.location = "http://localhost:8080/dashboard"
            }, 1000)
        } else {
            // show error message that users wallet address is invalid
            alert.show();
            alert.removeClass("alert-warning");
            alert.addClass("alert-danger");
            alert.text("Address not found");
        }

    } else {
        // show error message that users HAS to fill in the wallet address field 
        alert.show();
        alert.removeClass("alert-danger");
        alert.addClass("alert-warning");
        alert.text("Please fill in your wallet address");
    }
    
});
