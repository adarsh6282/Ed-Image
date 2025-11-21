import { UserDTO } from "../DTO/user.dto";
import { IUser } from "../models/interfaces/user.interface";

export const toUserDTO=(user:IUser):UserDTO=>{
    return {
        _id:user._id.toString(),
        name:user.name,
        email:user.email,
        phone:user.phone
    }
}