import { Router } from "express";
import upload from "../utils/multer";
import authUser from "../middleware/authUser";
import { imageController } from "../DependencyHandlers/image.dependencyhandler";

const router=Router()

router.post("/upload",upload.array("images"),authUser(),imageController.uploadImages.bind(imageController))
router.get("/",authUser(),imageController.getImages.bind(imageController))
router.put("/reorder",authUser(),imageController.reOrderImage.bind(imageController))
router.put("/:id",upload.single("image"),authUser(),imageController.editImage.bind(imageController))
router.delete("/:id",authUser(),imageController.deleteImage.bind(imageController))

export default router