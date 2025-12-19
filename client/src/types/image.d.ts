export interface UploadedImage {
  _id: string;
  userId: string;
  title: string;
  url: string;
  position:number;
  public_url: string;
  createdAt?: string;
  updatedAt?: string;
}
