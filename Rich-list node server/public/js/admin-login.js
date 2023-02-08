import * as session from "./session.js"
 $(function(){
    $(".alert").hide();
});

$("#login").on("click", async function(){
    login();
})

$("#Password").keypress(function(event){
    if(event.keyCode == 13){
        login();
    }
})

function login(){
    let email = $("#Email").val()
    let password = $("#Password").val()

    firebase.auth().signInWithEmailAndPassword(email,password)
    .then(async(userCred) => {
        let token = await userCred.user.getIdToken()
    
        $.cookie("email", userCred.user.email)
    
        $.cookie("token", token)
    
        window.location = "http://localhost:8080/admin"
    })
    .catch((error)  => {
        $(".alert").show()
        $(".alert").text("Incorrect credentials")
    })
}



