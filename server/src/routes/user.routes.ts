import { Router } from "express";
import { userController } from "../DependencyHandlers/user.dependencyhandler";

const router = Router();

router.post("/login",userController.loginUser.bind(userController))
router.post("/register", userController.registerUser.bind(userController));
router.post("/verify-otp", userController.verifyOtp.bind(userController));
router.post("/resent-otp", userController.resentOtp.bind(userController));
router.post(
  "/forgot-password",
  userController.handleForgotPassword.bind(userController)
);
router.post("/verify-forgot-otp",userController.verifyForgotOtp.bind(userController))
router.post("/reset-password",userController.resetPassword.bind(userController))
router.post("/refresh-token",userController.refreshToken.bind(userController))
router.post("/logout",userController.logOut.bind(userController))
export default router;
