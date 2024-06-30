require("dotenv").config()

const MONGODBURL=process.env.MONGODB
const PORT=process.env.PORT
const SECRET_KEY=process.env.SECRET_KEY
const PASSWORD=process.env.PASSWORD
module.exports={
    MONGODBURL,PORT,SECRET_KEY,PASSWORD
}
