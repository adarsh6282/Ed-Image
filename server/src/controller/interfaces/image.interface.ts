import { Request, Response } from "express";

export interface IImageController{
    uploadImages(req:Request,res:Response):Promise<void>
    getImages(req:Request,res:Response):Promise<void>
    editImage(req:Request,res:Response):Promise<void>
    deleteImage(req:Request,res:Response):Promise<void>
    reOrderImage(req:Request,res:Response):Promise<void>
}