const home = "https://localhost:8080"; 

function checkCredentials(req, res, next){
    let secret = req.body.password;

    if(secret == "XRPledgerSetup"){
        next();
    }else {
        res.redirect("/login")
    }
}

module.exports = {
    checkCredentials
}