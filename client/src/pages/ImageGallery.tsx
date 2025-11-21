import { useState, useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
import type { UploadedImage } from "../types/image";
import { useNavigate } from "react-router-dom";
import { Camera, Sparkles, Trash, Upload } from "lucide-react";
import { deleteImage, getImages, imageUploadS, reorderImage, updateImage } from "../services/image.services";
import { successToast } from "../components/Toast";

export default function ImageGallery() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const editImageInputRef = useRef<HTMLInputElement | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    setFiles(selected);
    setTitles(selected.map(() => ""));
  };

  const handleUpload = async () => {
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append("images", file);
      formData.append("titles", titles[index]);
    });

    await imageUploadS(formData)

    loadImages();
    setFiles([]);
    setTitles([]);
  };

  const loadImages = async () => {
    const res = await getImages()
    setImages(res.data);
  };

  const saveChanges = async (imageId: string) => {
    const formData = new FormData();
    formData.append("title", newTitle);
    if (newImage) formData.append("image", newImage);

    await updateImage(imageId,formData)

    setEditingId(null);
    setNewImage(null);
    loadImages();
  };

  const handleDelete = async (id: string) => {
    try {
      const response=await deleteImage(id)
      const message=response.data.message
      successToast(message)
      loadImages();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...images];
    const draggedItem = updated[draggedIndex];

    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);

    setImages(updated);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    const order = images.map((img) => img._id);
    const response = await reorderImage(order)
    const message=response.data.message
    successToast(message)
  };

  const handleLogout=()=>{
    successToast("Logout Successfully")
    localStorage.removeItem("token")
    navigate("/")
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
    } else {
      loadImages();
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-6 relative overflow-hidden">
      <div className="w-full flex justify-end mb-6">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 
             text-white rounded-xl shadow 
             transition-all flex items-center gap-2"
        >
          Logout
        </button>
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full">
                <Camera size={32} className="text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent drop-shadow-lg">
            Image Gallery
          </h1>
          <p className="text-white/90 text-sm">
            Upload and manage your creative masterpieces
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-8 mb-10 border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
              <Upload size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Upload Images
            </h2>
          </div>

          <label className="relative group cursor-pointer block">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center transition-all duration-300 hover:border-purple-500 hover:bg-purple-50 group-hover:scale-[1.02]">
              <Upload
                size={48}
                className="mx-auto mb-4 text-gray-400 group-hover:text-purple-600 transition-colors"
              />
              <p className="text-gray-600 font-semibold mb-2">
                Click to upload
              </p>
              <p className="text-sm text-gray-500">PNG, JPG, JPEG</p>
            </div>
          </label>

          {files.length > 0 && (
            <div className="space-y-4 mt-6">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border-2 border-purple-200 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
                    <img
                      src={URL.createObjectURL(file)}
                      className="relative w-20 h-20 object-cover rounded-xl shadow-lg"
                      alt="Preview"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Enter image title..."
                    value={titles[index]}
                    onChange={(e) => {
                      const updated = [...titles];
                      updated[index] = e.target.value;
                      setTitles(updated);
                    }}
                    className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white"
                  />
                </div>
              ))}

              <button
                onClick={handleUpload}
                className="relative w-full p-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Upload All Images
                  <Sparkles
                    size={18}
                    className="group-hover:rotate-12 transition-transform"
                  />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          )}
        </div>

        <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
              <Camera size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Your Gallery
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((img, index) => (
              <div
                key={img._id}
                draggable={editingId !== img._id}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`group relative bg-white rounded-2xl overflow-hidden border-2 border-transparent hover:border-purple-300 
      transition-transform duration-300 ${
        draggedIndex === index ? "opacity-60 scale-95" : ""
      }`}
              >
                <div className="relative">
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 z-10"></div>

                  {editingId === img._id ? (
                    <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
                      <img
                        src={newImage ? URL.createObjectURL(newImage) : img.url}
                        className="w-full h-48 object-cover"
                      />

                      <input
                        ref={editImageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          setNewImage(e.target.files?.[0] || null)
                        }
                      />

                      <button
                        onClick={() => editImageInputRef.current?.click()}
                        className="absolute bottom-2 right-2 bg-white px-3 py-1 text-xs 
                 rounded-lg shadow hover:bg-gray-100 border border-gray-300"
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <img
                      src={img.url}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      alt={img.title}
                    />
                  )}
                </div>

                <div className="p-4">
                  {editingId === img._id ? (
                    <input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full p-2 border rounded-lg text-center"
                    />
                  ) : (
                    <p className="font-semibold text-center text-gray-800 group-hover:text-purple-600 transition-colors">
                      {img.title}
                    </p>
                  )}
                </div>

                {editingId !== img._id && (
                  <div className="absolute top-3 right-3 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <button
                      onClick={() => {
                        setEditingId(img._id);
                        setNewTitle(img.title);
                        setNewImage(null);
                      }}
                      className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg"
                    >
                      <Sparkles size={16} className="text-purple-600" />
                    </button>

                    <button
                      onClick={() => handleDelete(img._id)}
                      className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg"
                    >
                      <Trash size={16} className="text-red-500" />
                    </button>
                  </div>
                )}

                {editingId === img._id && (
                  <div className="absolute bottom-3 right-3 flex gap-2 z-20">
                    <button
                      onClick={() => saveChanges(img._id)}
                      className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg shadow hover:bg-purple-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setNewImage(null);
                      }}
                      className="px-3 py-1 bg-gray-300 text-sm rounded-lg shadow hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {images.length === 0 && (
            <div className="text-center py-12">
              <Camera size={64} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">No images uploaded yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Start uploading to see your gallery!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
