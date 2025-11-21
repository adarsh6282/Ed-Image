import { ImageRepository } from "../repository/implemetations/image.repository";
import { ImageService } from "../services/implementations/image.services";
import { ImageController } from "../controller/implementations/image.controller";

const imageRepository=new ImageRepository()
const imageService=new ImageService(imageRepository)
export const imageController=new ImageController(imageService)