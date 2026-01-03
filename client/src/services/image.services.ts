import {api} from "../services/apiService";
import type { UploadedImage } from "../types/image";

export const imageUploadS = async (formData: FormData) => {
  return api.post("/images/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getImages = async (page:number,limit:number) => {
  return await api.get<{images:UploadedImage[],total:number}>(`/images?page=${page}&limit=${limit}`);
};

export const updateImage = async (imageId: string, formData: FormData) => {
  await api.put(`/images/${imageId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteImage=async(id:string)=>{
    return await api.delete(`/images/${id}`);
}

export const reorderImage=async(order:{ id: string; position: number; }[])=>{
    return await api.put("/images/reorder", { order });
}