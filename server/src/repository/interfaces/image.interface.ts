import { IImage } from "../../models/interfaces/image.interface";

export interface IImageRepository{
    createImage(data:Partial<IImage>):Promise<IImage>
    findAllImages(userId:string):Promise<IImage[]|null>
    findById(id:string):Promise<IImage|null>
    updateImageById(id:string,updateData:Partial<IImage>):Promise<IImage|null>
    deleteImage(id:string):Promise<IImage|null>
    updatePosition(imageId: string, newPos: number, userId: string):Promise<IImage|null>
    findLastImage(userId:string):Promise<IImage|null>
    findPaginatedImages(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ images: IImage[]; total: number }>
}