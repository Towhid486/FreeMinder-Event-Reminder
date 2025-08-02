import { NextFunction, Request, Response } from "express";
import {DecodeToken} from "../utility/TokenHelper";
const AuthVerification=(req:Request,res:Response,next:NextFunction)=>{

    // Receive Token
    let token=req.headers['token'] as string
    // Token Decode
    let decoded=DecodeToken(token) as { email: string, user_id: string } | null;

    // Request Header Email+UserID Add
    if(decoded===null){
        return res.status(401).json({status:"fail", message:"Unauthorized"})
    }
    else {
        let email=decoded['email'];
        let user_id=decoded['user_id'];
        req.headers.email=email;
        req.headers.user_id=user_id;
        next();
    }
}
export default AuthVerification;