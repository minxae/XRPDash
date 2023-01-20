import * as session from "./session.js"
 $(function(){
    $(".alert").hide();
});

$("#login").on("click", async function(){
    let email = $("#Email").val()
    let password = $("#Password").val()

    await firebase.auth().signInWithEmailAndPassword(email,password)

    let token = await firebase.auth().currentUser.getIdToken();

    $.cookie("token", token)

    window.location =  "http://localhost:8080/admin"

})



