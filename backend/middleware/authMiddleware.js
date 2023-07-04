const jwt=require('jsonwebtoken')
const User=require("../models/userModel")
const asyncHandler=require("express-async-handler")

const protect=asyncHandler(async (req, res, next)=>{
    let token

    if(
        req.headers.authorization && req.headers.authorization.startsWith("Bearer") //token will be sent by us in req.headers. Bearer token
    ){
        try{
            token=req.headers.authorization.split(" ")[1]
            //token would be something like Bearer skjgsfjgslfakjg
            //decodes token id
            const decoded=jwt.verify(token, "robin")

            req.user=await User.findById(decoded.id).select("-password")
            next()


        } catch(error){
            res.status(401)
            throw new Error("Not authorized, Token failed")
        }
    }

    if(!token){
        res.status(401)
        throw new Error("Not authorized, No token")
    }
})

module.exports={protect}
