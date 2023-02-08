import * as api from "./admin-apihelper.js";

const socket = new WebSocket('ws://localhost:8080');

let success = "#51c849"
let failed = "#ee5656"
let waring = ""

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
        let name = $.cookie("email").split("@");
        $(".welcome-message").html("Welcome, " + "<b class='blue'>" + $.cookie("email") + "</b>");

        Toastify({
            text: `Welcome ${name[0]}`,
            duration: 3000,
            stopOnFocus: true,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: {
                background: "#007bff",
                "box-shadow": "0xp 0px 0px 0px black"
                
            }
        }).showToast();
    }
    // Generate quote 
    $(".quote").html(quotes[Math.floor(Math.random() * (quotes.length - 0 + 1) + 0)]);

})

// ledger functions ->
$("#cancelBtn").on("click", async function(){
    let modal = $("#cancelModal");
    modal.modal();
})

$("#cancelContinue").on("click", async function(){
    $("#cancelModal").modal("hide");
    let data = await api.cancel();
    let json = await data.json();
    if(data.status == 200){
        toast(json.message, success)
    }else {
        toast(json.message, failed)
    }
})

$("#setupBtn").on("click", async function(){
    let modal = $("#setupModal");
    modal.modal();  
    
})

$("#setupContinue").on("click", async function(){
    $("#setupModal").modal("hide");
    let data = await api.setup();
    let json = await data.json();
    console.log(json)
    if(data.status == 200){
        toast(json.message, success)
    }else {
        toast(json.message, failed)
    }
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

    $(".card-footer").text(convertDateToDiffBetween(data.date.lastUpdated) + " days ago");
    

    $("#progressBar").attr({
        "style": "width:" + data.progress.percentage +"%",
        "aria-valuenow": data.progress.percentage +"%",
    })
    $("#progressBar").text(data.progress.percentage +"%");

    $("#cancelBtn").toggleClass("disabled", !data.status.t1_loadingAccount);
}

function toast(text, color){
    Toastify({
        text: text,
        duration: 3000,
        stopOnFocus: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
            background: color,
        }
    }).showToast();
}

function convertDateToDiffBetween(date){
    var date = new Date(date);
    var today = new Date();
    var diffInMilliseconds = today - date;
    var diffInDays = diffInMilliseconds / 86400000;

    return Math.floor(diffInDays)
}






