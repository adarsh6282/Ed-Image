import mongoose from "mongoose";
import { IImage } from "../../models/interfaces/image.interface";
import { IImageRepository } from "../../repository/interfaces/image.interface";
import { IImageService } from "../interfaces/image.interface";
import cloudinary from "../../config/cloudinary.config";
import { ImageDTO, ImageViewDTO } from "../../DTO/image.dto";
import {
  toImageDTO,
  toImageDTOList,
  toImageViewDTO,
} from "../../Mappers/image.mapper";

export class ImageService implements IImageService {
  constructor(private _imageRepository: IImageRepository) {}

  async uploadImages(
    files: Express.Multer.File[],
    titles: string[],
    userId: string
  ): Promise<ImageDTO[]> {
    const lastImage = await this._imageRepository.findLastImage(userId);
    let currrentPosition = lastImage ? lastImage.position + 1 : 0;
    const UploadedImages = [];
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let title = titles[i] || file.originalname;

      const image = await this._imageRepository.createImage({
        title,
        url: file.path,
        public_id: file.filename,
        position: currrentPosition++,
        userId: new mongoose.Types.ObjectId(userId),
      });
      UploadedImages.push(image);
    }
    if (!UploadedImages) {
      throw new Error("failed to upload images");
    }
    return toImageDTOList(UploadedImages);
  }

  async getImages(userId: string): Promise<ImageViewDTO[]> {
    const images = await this._imageRepository.findAllImages(userId);

    if (!images) {
      throw new Error("images not found");
    }

    return images.map((img) => {
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = now + 60 * 5;

      const signedUrl = cloudinary.url(img.public_id, {
        type: "private",
        sign_url: true,
        expires_at: expiresAt,
        secure: true,
        version: now,
      });

      return toImageViewDTO({
        _id: img._id!,
        title: img.title,
        signedUrl,
        public_id: img.public_id,
        position: img.position,
        expiresAt,
      });
    });
  }

  async updateImage(
    id: string,
    title: string,
    newFile?: Express.Multer.File
  ): Promise<ImageDTO> {
    const existingImage = await this._imageRepository.findById(id);
    if (!existingImage) {
      throw new Error("no existing image");
    }

    let updatedData: Partial<IImage> = { title };
    if (newFile) {
      await cloudinary.uploader.destroy(existingImage.public_id);

      updatedData = {
        ...updatedData,
        url: newFile.path,
        public_id: newFile.filename,
      };
    }

    const updatedImage = await this._imageRepository.updateImageById(
      id,
      updatedData
    );
    if (!updatedImage) {
      throw new Error("failed to update image");
    }
    return toImageDTO(updatedImage);
  }

  async deleteImage(id: string): Promise<ImageDTO> {
    const image = await this._imageRepository.findById(id);
    if (!image) {
      throw new Error("image not found");
    }
    await cloudinary.uploader.destroy(image.public_id);
    const deleted = await this._imageRepository.deleteImage(id);
    if (!deleted) {
      throw new Error("failed to delete image");
    }
    return toImageDTO(deleted);
  }

  async reorderImages(orders: string[], userId: string): Promise<void> {
    for (let i = 0; i < orders.length; i++) {
      await this._imageRepository.updatePosition(orders[i], i, userId);
    }
  }
}
