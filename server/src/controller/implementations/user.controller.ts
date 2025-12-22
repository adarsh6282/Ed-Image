import { Request, Response } from "express";
import { IUserController } from "../interfaces/user.interface";
import { IUserService } from "../../services/interfaces/user.interface";
import { httpStatus } from "../../constants/statusCodes";
import jwt from "jsonwebtoken";
import { generateToken } from "../../utils/jwt";

export class UserController implements IUserController {
  constructor(private _userService: IUserService) {}

  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, token, refreshToken } = await this._userService.loginUser(
        email,
        password
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/",
        secure: true,
        sameSite: "none",
        maxAge: Number(process.env.COOKIE_MAXAGE),
      });

      res
        .status(httpStatus.OK)
        .json({ user, token, message: "Login Successfull" });
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
      const { user, token, refreshToken } = await this._userService.verifyOtp(
        userData
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/",
        secure: true,
        sameSite: "none",
        maxAge: Number(process.env.COOKIE_MAXAGE),
      });

      res
        .status(httpStatus.OK)
        .json({ user, token, message: "Register success" });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async resentOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this._userService.resentOtp(email);
      res.status(httpStatus.OK).json({ message: "Otp resent Successfully" });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async handleForgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this._userService.handleForgotPassword(email);
      res.status(httpStatus.OK).json({ message: "Otp Sent Successfully" });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async verifyForgotOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      await this._userService.verifyForgotOtp(email, otp);
      res.status(httpStatus.OK).json({ message: "OTP Verfied" });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, newPassword, confirmPassword } = req.body;
      await this._userService.resetPassword(
        email,
        newPassword,
        confirmPassword
      );
      res.status(httpStatus.OK).json({ message: "Password Reset Successfull" });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const token = req.cookies.refreshToken;

    if (!token) {
      res.status(httpStatus.UNAUTHORIZED).json({ message: "No Refresh Token" });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
        _id: string;
        email: string;
      };

      const usersToken = generateToken(decoded._id, decoded.email);
      res.status(httpStatus.OK).json({ token: usersToken });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async logOut(req: Request, res: Response): Promise<void> {
    res.clearCookie("userRefreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    res.status(httpStatus.OK).json({ message: "Logged out successfully" });
  }
}
