import jwt from "jsonwebtoken"
import { ErrorHandler } from "../utils/utility.js";
import { adminSecretKey } from "../app.js";
import { TryCatch } from "./error.js";
import { CHATTY_TOKEN } from "../constants/config.js";
import { User } from "../models/user.js";


const isAuthenticated = TryCatch((req,res,next)=>{
    const token = req.cookies[CHATTY_TOKEN]
    if(!token){
        return next(new ErrorHandler("please login to access the page",401))
    }
    const decodeData =  jwt.verify(token,process.env.JWT_SECRET)
    req.user = decodeData._id;
    next();
})
const adminOnly = (req,res,next)=>{
    console.log("cookie",req.cookies)
    const token = req.cookies["chatty-admin-token"]
    if(!token){
        return next(new ErrorHandler("Only admin can access the page",401))
    }
    const secretKey =  jwt.verify(token,process.env.JWT_SECRET)
    const isMatch = secretKey === adminSecretKey
    if(!isMatch) return next(new ErrorHandler("Invalid secret key", 401));
    next()
}

const socketAuthenticator = async(error,socket,next)=>{
    try{
        if(error) return next(error)
        const authToken = socket.request.cookies[CHATTY_TOKEN]
        if(!authToken) return next(new ErrorHandler("Please login to access",401))
        const decodedData = jwt.verify(authToken,process.env.JWT_SECRET)
        const user = await User.findById(decodedData._id);
        if(!user) return next(new ErrorHandler("Please login to access this route",401))
        socket.user = user;
        return next()

    }catch(error){
        console.log("Socket authentication error",error)
        return next(new ErrorHandler("Please login to access",401))
    }

};
export {isAuthenticated,adminOnly,socketAuthenticator}