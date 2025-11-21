import { IUser } from "../../models/interfaces/user.interface";

export interface IUserRepository{
    findByEmail(email:string):Promise<IUser|null>
    createUser(data:Partial<IUser>):Promise<IUser|null>
    updateUser(email:string,hashed:string):Promise<IUser|null>
}