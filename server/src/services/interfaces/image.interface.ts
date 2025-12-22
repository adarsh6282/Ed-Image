import { ImageDTO, ImageViewDTO } from "../../DTO/image.dto";
import { IImage } from "../../models/interfaces/image.interface";

export interface IImageService{
    uploadImages(files:Express.Multer.File[],titles:string[],userId:string):Promise<ImageDTO[]>
    getImages(userId:string):Promise<ImageViewDTO[]>
    updateImage(id:string,title:string,newFile?:Express.Multer.File):Promise<ImageDTO>
    deleteImage(id:string):Promise<ImageDTO>
    reorderImages(orders:string[],userId:string):Promise<void>
}