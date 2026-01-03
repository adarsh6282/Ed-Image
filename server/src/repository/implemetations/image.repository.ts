import { IImage } from "../../models/interfaces/image.interface";
import { IImageRepository } from "../interfaces/image.interface";
import Image from "../../models/implementations/imageModel";
import mongoose from "mongoose";

export class ImageRepository implements IImageRepository {
  async createImage(data: Partial<IImage>): Promise<IImage> {
    return await Image.create(data);
  }

  async findAllImages(userId: string): Promise<IImage[] | null> {
    return await Image.find({ userId: userId }).sort({ position: -1 });
  }

  async findById(id: string): Promise<IImage | null> {
    return await Image.findById(id);
  }

  async updateImageById(
    id: string,
    updateData: Partial<IImage>
  ): Promise<IImage | null> {
    return await Image.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteImage(id: string): Promise<IImage | null> {
    return await Image.findByIdAndDelete(id);
  }

  async updatePosition(
    imageId: string,
    newPos: number,
    userId: string
  ): Promise<IImage | null> {
    const order = await Image.findOneAndUpdate(
      { _id: imageId, userId: new mongoose.Types.ObjectId(userId) },
      { position: newPos }
    );
    return order;
  }

  async findLastImage(userId: string): Promise<IImage | null> {
    return await Image.findOne({ userId }).sort({ position: -1 });
  }

  async findPaginatedImages(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ images: IImage[]; total: number }> {
    const skip = (page - 1) * limit;

    const [images, total] = await Promise.all([
      Image.find({ userId }).sort({ position: 1 }).skip(skip).limit(limit),

      Image.countDocuments({ userId }),
    ]);

    return { images, total };
  }
}
