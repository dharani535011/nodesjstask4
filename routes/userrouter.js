const express=require("express")
const usercontroller = require("../controllers/usercontroller")
const auth = require("../middleware/autho")
const Userroute=express.Router()


Userroute.post("/create",usercontroller.create)
Userroute.post("/login",usercontroller.login)
Userroute.post("/forgetpassword",usercontroller.fogetpassword)
Userroute.post("/resetpassword",usercontroller.resetpassword)


// protective routes
Userroute.get("/users",auth.verifytoken,usercontroller.getalluser)
Userroute.post("/logout",auth.verifytoken,usercontroller.logout)
module.exports=Userroute
