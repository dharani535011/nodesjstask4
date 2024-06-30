const mongoose=require("mongoose")


const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    randomstring:String
})

const User=mongoose.model("User",userSchema,"users")
module.exports=User