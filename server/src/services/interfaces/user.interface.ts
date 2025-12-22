import { UserDTO } from "../../DTO/user.dto";
import { IUser } from "../../models/interfaces/user.interface";

export interface IUserService {
  loginUser(
    email: string,
    password: string
  ): Promise<{ user: UserDTO; token: string; refreshToken:string }>;
  registerUser(email: string): Promise<void>;
  verifyOtp(
    data: IUser & { otp: string }
  ): Promise<{ user: UserDTO; token: string; refreshToken:string }>;
  resentOtp(email:string):Promise<void>
  handleForgotPassword(email:string):Promise<void>
  verifyForgotOtp(email:string,otp:string):Promise<boolean>
  resetPassword(email:string,newPassword:string,confirmPassword:string):Promise<boolean>
}
