import { Request, Response } from "express";
import { IImageController } from "../interfaces/image.interface";
import { IImageService } from "../../services/interfaces/image.interface";
import { httpStatus } from "../../constants/statusCodes";

export class ImageController implements IImageController {
  constructor(private _imageService: IImageService) {}

  async uploadImages(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const files = req.files as Express.Multer.File[];
      let titles = req.body.titles;

      if (!Array.isArray(titles)) {
        titles = [titles];
      }

      if (titles.length !== files.length) {
        res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: "Each image must have a title",
        });
        return;
      }

      const UploadedImages = await this._imageService.uploadImages(
        files,
        titles,
        userId!
      );
      res.status(httpStatus.OK).json(UploadedImages);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async getImages(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const images = await this._imageService.getImages(userId!);
      res.status(httpStatus.OK).json(images);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async editImage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title } = req.body;

      const updated = await this._imageService.updateImage(id, title, req.file);
      res.status(httpStatus.OK).json(updated);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async deleteImage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this._imageService.deleteImage(id);
      res.status(httpStatus.OK).json({ message: "Image Deleted" });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async reOrderImage(req: Request, res: Response): Promise<void> {
    try {
      const {order} = req.body;
      console.log(order)
      const userId=req.user?.id

      if (!Array.isArray(order)) {
        res
          .status(httpStatus.BAD_REQUEST)
          .json({ success: false, message: "Invalid order format" });
        return;
      }

      await this._imageService.reorderImages(order,userId!);

      res
        .status(httpStatus.OK)
        .json({ success: true, message: "Reordered successfully" });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }
}
