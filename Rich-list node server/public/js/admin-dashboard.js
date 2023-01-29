import * as api from "./admin-apihelper.js";

const socket = new WebSocket('ws://localhost:8080');

let quotes = [
    "It always seems impossible until it's done - <i class='text-pink'>Nelson Mandela </i>",
    "Today i will do what other won't, so tomorrow i can accomplish what others can't - <i>Jerry Rice</i>",
    "Just believe in yourself. Even if you dont, <b>pretend that you do</b> and, at some point, <b>you will.</b> - <i>Venus Williams</i>",
    "Be so good they can't ignore you - <i>Steven Martin</i>",
    "If <b>my mind</b> can conceive it, if <b>my heart</b> can believe it, then <b>I can achieve it.</b> - <i>Muhammed Ali</i>",
    "The starting point of all achievement is desire - <i>Napolean Hill</i>",
    "Believe you can and you're halfway there - <i>Theodore Roosevelt</i>"
]

$(function(){
    if($.cookie("email")){
        $(".welcome-message").html("Welcome, " + "<b class='blue'>" + $.cookie("email") + "</b>")
    }
    // Generate quote 
    $(".quote").html(quotes[Math.floor(Math.random() * (quotes.length - 0 + 1) + 0)])

    
    // socket.onmessage = (event) =>  {
    //     console.log(event.data)
    // }

})

// ledger functions ->
$("#cancelBtn").on("click", async function(){
    let modal = $("#cancelModal");
    modal.modal();
    $("#cancelContinue").on("click", async function(){
        modal.modal("hide")
        api.cancel();
        
    })
})

$("#setupBtn").on("click", async function(){
    let modal = $("#setupModal");
    modal.modal();
    $("#setupContinue").on("click", async function(){
        modal.modal("hide");
        api.setup();
    })
})

socket.addEventListener("open", (event) => {
    console.log("connected to the server")
    socket.addEventListener("message", (event) => {
        let data = JSON.parse(event.data)
        updateStatusData(data);
    })
});

function updateStatusData(data){
    $("#status-live-indicator").toggleClass("blue", data.status.t1_loadingAccount);
    $("#status-started").toggleClass("blue", data.status.t1_loadingAccount);
    $("#status-started-writing").toggleClass("blue", data.status.t2_writingAccount);
    
    $("#amount-accounts").text(data.progress.amountOfAccountsLoaded) ;
    $("#accounts-percentage").text(data.progress.percentage + "%");

    $(".card-footer").text(data.date.lastUpdated);

    $("#progressBar").attr({
        "style": "width:" + data.progress.percentage +"%",
        "aria-valuenow": data.progress.percentage +"%",
    })
    $("#progressBar").text(data.progress.percentage +"%");

    $("#cancelBtn").toggleClass("disabled", !data.status.t1_loadingAccount);
}






