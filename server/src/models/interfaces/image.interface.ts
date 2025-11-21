import mongoose from "mongoose";

export interface IImage {
  _id?: string;
  title: string;
  url: string;
  public_id: string;
  userId: mongoose.Types.ObjectId;
  position: number;
  createdAt?: Date;
  updatedAt?: Date;
}