import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/user.interface";

const userSchema:Schema<IUser> = new Schema({
    name:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
    },
})

export default mongoose.model<IUser>("User",userSchema)