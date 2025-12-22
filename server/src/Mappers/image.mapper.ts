import { ImageDTO, ImageViewDTO } from "../DTO/image.dto";
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

export const toImageViewDTO = (data: {
  _id: string;
  title: string;
  signedUrl: string;
  public_id: string;
  position: number;
  expiresAt: number;
}): ImageViewDTO => ({
  _id: data._id.toString(),
  title: data.title,
  signedUrl: data.signedUrl,
  public_id: data.public_id,
  position: data.position,
  expiresAt: data.expiresAt,
});

export const toImageViewDTOList = (
  images: ReturnType<typeof toImageViewDTO>[]
): ImageViewDTO[] => images;
