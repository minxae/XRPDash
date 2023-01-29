let baseUrl = "http://localhost:8080"
let quotes = [
    "It always seems impossible until it's done - <i class='text-pink'>Nelson Mandela </i>",
    "Today i will do what other won't, so tomorrow i can accomplish what others can't - <i>Jerry Rice</i>",
    "Just believe in yourself. Even if you dont, <b>pretend that you do</b> and, at some point, <b>you will.</b> - <i>Venus Williams</i>",
    "Be so good they can't ignore you - <i>Steven Martin</i>",
    "If <b>my mind</b> can conceive it, if <b>my heart</b> can believe it, then <b>I can achieve it.</b> - <i>Muhammed Ali</i>",
    "The starting point of all achievement is desire - <i>Napolean Hill</i>",
    "Believ you can and you're halfway there - <i>Theodore Roosevelt</i>"
]
$(function(){
    if($.cookie("email")){
        $(".welcome-message").html("Welcome, " + "<b class='blue'>" + $.cookie("email") + "</b>")
    }
    //$('#Modal1').modal()
    
    // Generate quote 
    $(".quote").html(quotes[Math.floor(Math.random() * (quotes.length - 0 + 1) + 0)])

    $(".alert").hide()
    $(".update").hide()
})

$(".updateBtn").on("click", function(){
    setup()
})
$(".statusBtn").on("click", function(){
    status()
})
$(".cancelSetupBtn").on("click", function(){

})

async function setup(){
    let url =  baseUrl + "/admin/setup";
    let alert
    $(".update").show()
    try {
        let response = await fetch(url);
        let json = await response.json();
        if(response.status == 200){
            alert.show();
            alert.removeClass("alert-danger");
            alert.addClass("alert-success");
            alert.text(json.message);
            $(".update").hide()
        } else {
            alert.show();
            alert.text("Could not setup all accounts at the moment");
            $(".update").hide()
        }
    } catch(err){
        console.log(err);
    }
}

async function status(){
    let url =  baseUrl + "/admin/status";

    try {
        let response = await fetch(url);
        let json = await response.json();
        if(response.status == 200){
            alert.show();
            alert.removeClass("alert-danger");
            alert.addClass("alert-success");
            alert.text(json.message);
        } else {
            $(".alert").show();
            $(".alert").text(json.message)
        }
    } catch(err){
        console.log(err);
    }
}


