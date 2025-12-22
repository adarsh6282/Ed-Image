import { ImageDTO } from "../../DTO/image.dto";

export interface IImageService{
    uploadImages(files:Express.Multer.File[],titles:string[],userId:string):Promise<ImageDTO[]>
    getImages(userId:string):Promise<ImageDTO[]>
    updateImage(id:string,title:string,newFile?:Express.Multer.File):Promise<ImageDTO>
    deleteImage(id:string):Promise<ImageDTO>
    reorderImages(orders:string[],userId:string):Promise<void>
}