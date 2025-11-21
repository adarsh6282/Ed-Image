import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/implementations/userModel"
import { httpStatus } from "../constants/statusCodes";

interface DecodedToken {
  _id: string;
  email: string;
}

const authUser = () => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: "Authentication failed. Token missing or malformed.",
        });
        return;
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

      const user = await User.findById(decoded._id);

      if (!user) {
        res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      req.user = {
        id: user._id.toString(),
        email: user.email,
      };

      next();
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message,
      });
    }
  };
};

export default authUser;
