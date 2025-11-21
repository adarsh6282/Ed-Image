import { Request, Response } from "express";
import { IUserController } from "../interfaces/user.interface";
import { IUserService } from "../../services/interfaces/user.interface";
import { httpStatus } from "../../constants/statusCodes";

export class UserController implements IUserController {
  constructor(private _userService: IUserService) {}

  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const {user,token}=await this._userService.loginUser(email,password)
      res.status(httpStatus.OK).json({user,token,message:"Login Successfull"})
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this._userService.registerUser(email);
      res.status(httpStatus.OK).json({ message: "Otp sent Successfully" });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const { user, token } = await this._userService.verifyOtp(userData);
      res.status(httpStatus.OK).json({ user, token ,message:"Register success" });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async resentOtp(req: Request, res: Response): Promise<void> {
      try {
        const {email}=req.body
        await this._userService.resentOtp(email)
        res.status(httpStatus.OK).json({message:"Otp resent Successfully"})
      } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async handleForgotPassword(req: Request, res: Response): Promise<void> {
      try {
        const {email}=req.body
        await this._userService.handleForgotPassword(email)
        res.status(httpStatus.OK).json({message:"Otp Sent Successfully"})
      } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async verifyForgotOtp(req: Request, res: Response): Promise<void> {
      try {
        const {email,otp}=req.body
        await this._userService.verifyForgotOtp(email,otp)
        res.status(httpStatus.OK).json({message:"OTP Verfied"})
      } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
      try {
        const {email,newPassword,confirmPassword}=req.body
        await this._userService.resetPassword(email,newPassword,confirmPassword)
        res.status(httpStatus.OK).json({message:"Password Reset Successfull"})
      } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }
}
