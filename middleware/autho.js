
const jwt =require("jsonwebtoken")
const { SECRET_KEY } = require("../config/Mongodb")


const auth={
   verifytoken:async(req,res,next)=>{
         try{
            const token=req.cookies.token
            if(!token){
                return res.send({ message: 'Access denied' })
            }
            try{
                 const decodedtoken=jwt.verify(token,SECRET_KEY)
                 req.userid=decodedtoken.id
                 next()
            }catch(e){
                 return res.send("token invalid")
            }
         }catch(e){
            res.send(e.message)
         }
   }
}
module.exports=auth