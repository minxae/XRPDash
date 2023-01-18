const admin = require("firebase-admin")


function login(req, res){
    
}

async function signUp(req, res){
    const userResponse = await admin.auth().createUser({
        email : req.body.email,
        password : req.body.password
    })
    res.send(userResponse)
}

module.exports = {
    login,
    signUp
}