const admin = require("firebase-admin");
const home = "localhost:8080/login"; 

async function isAdmin(req, res, next) {
    if(req.cookies["token"]){
        let userToken =  req.cookies["token"];

        try {
            let user = await admin.auth().verifyIdToken(userToken)
            let role = await getRole(user.uid)
            if(role == "ADMIN"){
                next()
            }else {
                res.redirect("/login")
            }
        } catch (e) {
            res.redirect("/login")
        }

    }else {
        res.redirect("/login")
    }
}

async function getRole(uid){
    let db = admin.firestore()
    let collection = db.collection("Users")

    let user = await collection.where("UID", "==", uid).get()
    let userObject
    user.forEach(docs =>{
        userObject = docs.data()
    })

    return userObject.Role
}

module.exports = {
    isAdmin
}