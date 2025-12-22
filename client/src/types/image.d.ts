export interface UploadedImage {
  _id: string;
  userId?: string;
  title: string;
  url: string;
  position:number;
  public_id: string;
  expiresAt:number
}
