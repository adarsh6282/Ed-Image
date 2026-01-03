import { ImageDTO } from "../../DTO/image.dto";

export interface IImageService{
    uploadImages(files:Express.Multer.File[],titles:string[],userId:string):Promise<ImageDTO[]>
    getImages(userId:string,page:number,limit:number):Promise<{images:ImageDTO[],total:number}>
    updateImage(id:string,title:string,newFile?:Express.Multer.File):Promise<ImageDTO>
    deleteImage(id:string):Promise<ImageDTO>
    reorderImages(orders:{ id: string; position: number; }[],userId:string):Promise<void>
}