import { Request, Response } from "express";

export interface IUserController{
    loginUser(req:Request,res:Response):Promise<void>
    registerUser(req:Request,res:Response):Promise<void>
    verifyOtp(req:Request,res:Response):Promise<void>
    resentOtp(req:Request,res:Response):Promise<void>
    handleForgotPassword(req:Request,res:Response):Promise<void>
    verifyForgotOtp(req:Request,res:Response):Promise<void>
    resetPassword(req:Request,res:Response):Promise<void>
}