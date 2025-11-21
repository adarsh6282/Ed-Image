import { ImageDTO } from "../DTO/image.dto";
import { IImage } from "../models/interfaces/image.interface";

export const toImageDTO = (image: IImage): ImageDTO => {
  return {
    _id: image._id?.toString(),
    title: image.title,
    url: image.url,
    public_id: image.public_id,
    userId: image.userId.toString(),
    position: image.position,
  };
};

export const toImageDTOList=(images:IImage[]):ImageDTO[]=>{
    return images.map(toImageDTO)
}