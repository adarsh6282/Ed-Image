import { IOtp } from "../../models/interfaces/otp.interface";
import { IUser } from "../../models/interfaces/user.interface";

export interface IOtpRepository{
    saveOtp(data:{email:string,otp:string,expiresAt?:Date}):Promise<IOtp|null>
    findOtpbyEmail(email:string):Promise<IOtp|null>
    deleteOtpbyEmail(email:string):Promise<IUser|null>
}