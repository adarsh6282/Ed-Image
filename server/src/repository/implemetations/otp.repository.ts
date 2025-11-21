import { IOtp } from "../../models/interfaces/otp.interface";
import { IOtpRepository } from "../interfaces/otp.interface";
import Otp from "../../models/implementations/otpModel";
import { IUser } from "../../models/interfaces/user.interface";

export class OtpRepository implements IOtpRepository {
  async saveOtp(data: {
    email: string;
    otp: string;
    expiresAt?: Date;
  }): Promise<IOtp | null> {
    let saveotp: IOtp | null;
    const existing = await Otp.findOne({ email: data.email });

    if (existing) {
      saveotp = await Otp.findOneAndUpdate(
        { email: data.email },
        { otp: data.otp, expiresAt: data.expiresAt ?? new Date() },
        { new: true }
      );
    } else {
      saveotp = await Otp.create({
        email: data.email,
        otp: data.otp,
        expiresAt: data.expiresAt ?? new Date(),
      });
    }

    return saveotp;
  }

  async findOtpbyEmail(email: string): Promise<IOtp | null> {
      return await Otp.findOne({email})
  }

  async deleteOtpbyEmail(email: string): Promise<IUser | null> {
      return await Otp.findOneAndDelete({email})
  }
}
