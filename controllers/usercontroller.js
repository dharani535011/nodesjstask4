const { SECRET_KEY, PASSWORD } = require("../config/Mongodb")
const User = require("../models/usermodel")
const jwt =require("jsonwebtoken")
const bcrypt=require("bcrypt")
const crypto=require("crypto")
const nodemailer=require("nodemailer")
const usercontroller={
    create:async(req,res)=>{
        try{
         const {name,email,password}=req.body
         if(!name||!email||!password){
            return res.send({message:"full all the inputs"})
         }
         const user=await User.findOne({email})
         if(user){
            return res.send({message:"user is already exists"})
         }
         const hashpassword=await bcrypt.hash(password,10)
         const newuser=new User({name,email,password:hashpassword})
         const rees=await newuser.save()
         res.send({message:"user created successfully"})
        }catch(e){
            res.send(e.message)
        }
    },
    getalluser:async(req,res)=>{
           try{
            const user=await User.find()
            res.send(user)
           }catch(e){
            res.send(e.message)
           }
    },

    login:async(req,res)=>{
        try{
            const {email,password}=req.body
            if(!email||!password){
                return res.send({message:"full all the inputs"})
             }
             const user=await User.findOne({email})
             if(!user){
                return res.send({message:"user is not found"})
             }
           const ispassword=await bcrypt.compare(password,user.password)
           if(!ispassword){
            return res.send({message:"incorrect password"})
         }
        const token=jwt.sign({id:user._id},SECRET_KEY)

            res.cookie("token",token,{
                httpOnly:true,
                secure:true,
                sameSite:"none",
                expires:new Date(Date.now()+24*3600000)
            })
            res.json({message:"login successfully"})
        }catch(e){
            res.send(e.message)
        }
    },
    logout:(req,res)=>{
        try{
            res.clearCookie('token');
          res.json({message:"logout successfully"})
        }catch(e){
            res.send(e.message)
        }
    },
    fogetpassword:async(req,res)=>{
        try{
           const {email}=req.body
           const user=await User.findOne({email})
           if(!user){
          return  res.json({message:"user is not found"})
           }
           const randomstrings=crypto.randomBytes(6).toString("hex").slice(0,6)
           user.randomstring=randomstrings
           await user.save()
           let transport=nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"dharani535011@gmail.com",
                pass:PASSWORD
            }
           })
           await transport.sendMail({
            from:"dharani535011@gmail.com",
            to:user.email,
            subject:"password reset OTP",
            text:`change your password to use this otp : ${randomstrings}
            here's the link to reset your password ${'https://fluffy-entremet-b8c5d3.netlify.app/'}`
           })
           res.send({message:"OTP send to your mail.."})
        }catch(e){
            res.send(e.message)
        }
    },
    resetpassword:async(req,res)=>{
        try{
             const {otp,password,repass}=req.body
             const user=await User.findOne({randomstring:otp})
             if(!user){
               return res.send({message:"worng OTP"})
             }
             if(password!==repass){
                return res.send({message:"enter the same password in confrim password"})
             }

             const newpass=await bcrypt.hash(password,10)
             user.password=newpass
             user.randomstring=""
             await user.save()

             res.send({message:"password changed"})
             
        }catch(e){
            res.send(e.message)
        }
    }
}
module.exports= usercontroller