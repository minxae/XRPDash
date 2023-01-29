import * as session from "./session.js"
 $(function(){
    $(".alert").hide();
});

$("#login").on("click", async function(){
    let email = $("#Email").val()
    let password = $("#Password").val()

    firebase.auth().signInWithEmailAndPassword(email,password)
    .then(async(userCred) => {
        // let currentUser = await firebase.auth().currentUser
        $(".alert").show()
        $(".alert").text("GOOD ONE BILLY")
         let token = await userCred.user.getIdToken()
    
        $.cookie("email", userCred.user.email)
    
        $.cookie("token", token)
    
        window.location =  "https://87b8-94-213-95-72.eu.ngrok.io/admin"
    })
    .catch((error)  => {
        $(".alert").show()
        $(".alert").text("Incorrect credentials")
    })
   

})



