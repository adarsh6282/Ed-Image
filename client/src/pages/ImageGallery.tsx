import { useState, useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
import type { UploadedImage } from "../types/image";
import { BounceLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Sparkles,
  Trash,
  Upload,
  X,
  Plus,
  LogOut,
  Edit2,
  Check,
  ZoomIn,
} from "lucide-react";
import {
  deleteImage,
  getImages,
  imageUploadS,
  reorderImage,
  updateImage,
} from "../services/image.services";
import { errorToast, successToast } from "../components/Toast";
import type { AxiosError } from "axios";

export default function ImageGallery() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
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

    await imageUploadS(formData);

    loadImages();
    setFiles([]);
    setTitles([]);
    setShowUploadModal(false);
  };

  const loadImages = async () => {
    const res = await getImages();
    const sorted = res.data.sort(
    (a: UploadedImage, b: UploadedImage) => a.position - b.position
  );

  setImages(sorted);
  };

  const saveChanges = async (imageId: string) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", newTitle);
      if (newImage) formData.append("image", newImage);

      await updateImage(imageId, formData);

      setEditingId(null);
      setNewImage(null);
      loadImages();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteImage(id);
      const message = response.data.message;
      successToast(message);
      loadImages();
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      console.log(err);
      errorToast(error.response?.data?.message ?? "Something went wrong");
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
};


  const handleDragEnd = async () => {
    setDraggedIndex(null);
    const order = images.map((img) => img._id);
    const response = await reorderImage(order);
    const message = response.data.message;
    successToast(message);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...images];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, moved);

    setImages(updated);
    setDraggedIndex(null);
  };

  const handleLogout = () => {
    successToast("Logout Successfully");
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
    } else {
      loadImages();
    }
  }, [navigate]);

  const fullScreen = images.find((img) => img._id === fullScreenImage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/20 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur-lg opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white drop-shadow-lg">
                Gallery
              </h1>
              <p className="text-xs text-white/90">{images.length} images</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Plus size={18} />
              Upload
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 shadow-lg"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <Camera
                  size={80}
                  className="relative text-white drop-shadow-lg"
                />
              </div>
              <h2 className="text-2xl font-bold text-white drop-shadow-lg mb-2">
                No images yet
              </h2>
              <p className="text-white/90 mb-6 drop-shadow">
                Start building your gallery by uploading images
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Plus size={20} />
                Upload Images
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((img, index) => (
                <div
                  draggable={editingId !== img._id}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={handleDragEnd}
                  className={`group relative bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-white/40 hover:border-purple-300 shadow-xl transition-all duration-300 ${
                    draggedIndex === index
                      ? "opacity-50 scale-95"
                      : "hover:scale-105 hover:shadow-2xl"
                  }`}
                >
                  <div className="relative aspect-square overflow-hidden bg-black/40">
                    {editingId === img._id ? (
                      <>
                        <img
                          src={
                            newImage ? URL.createObjectURL(newImage) : img.url
                          }
                          className="w-full h-full object-cover"
                          alt={img.title}
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
                          className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-xs font-medium rounded-lg shadow-lg hover:bg-white transition-all"
                        >
                          Change Image
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="relative aspect-square overflow-hidden bg-black/40">
                          <img
                            src={img.url}
                            alt={img.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />

                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                          <button
                            onClick={() => setFullScreenImage(img._id)}
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            <div className="p-4 bg-white/90 rounded-full shadow-xl hover:scale-110 transition-transform">
                              <ZoomIn size={20} className="text-gray-800" />
                            </div>
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="p-4">
                    {editingId === img._id ? (
                      <input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-700 text-center focus:outline-none focus:border-purple-500 transition-all"
                        placeholder="Image title"
                      />
                    ) : (
                      <h3 className="font-semibold text-gray-800 text-center truncate group-hover:text-purple-700 transition-colors">
                        {img.title}
                      </h3>
                    )}
                  </div>

                  {editingId !== img._id ? (
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => {
                          setEditingId(img._id);
                          setNewTitle(img.title);
                          setNewImage(null);
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-all hover:scale-110"
                      >
                        <Edit2 size={16} className="text-purple-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(img._id)}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-all hover:scale-110"
                      >
                        <Trash size={16} className="text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={() => saveChanges(img._id)}
                        disabled={loading}
                        className="p-2 bg-green-500 rounded-lg shadow-lg hover:bg-green-600 transition-all"
                      >
                        {loading ? (
                          <BounceLoader size={16} color="#000000" />
                        ) : (
                          <Check size={16} className="text-white" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setNewImage(null);
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-all"
                      >
                        <X size={16} className="text-gray-700" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/40 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b-2 border-purple-100 p-6 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl shadow-lg">
                  <Upload size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                  Upload Images
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setFiles([]);
                  setTitles([]);
                }}
                className="p-2 hover:bg-purple-50 rounded-lg transition-all"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <label className="relative group cursor-pointer block">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center transition-all duration-300 hover:border-purple-500 hover:bg-purple-50 group-hover:scale-[1.02]">
                  <Upload
                    size={48}
                    className="mx-auto mb-4 text-gray-400 group-hover:text-purple-600 transition-colors"
                  />
                  <p className="text-gray-600 font-semibold mb-2">
                    Click to select images
                  </p>
                  <p className="text-sm text-gray-500">PNG, JPG, JPEG</p>
                </div>
              </label>

              {files.length > 0 && (
                <div className="space-y-4">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border-2 border-purple-200 shadow-sm"
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
                        className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-purple-500 transition-all"
                      />
                    </div>
                  ))}

                  <button
                    onClick={handleUpload}
                    className="relative w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles
                        size={20}
                        className="group-hover:rotate-12 transition-transform"
                      />
                      Upload {files.length}{" "}
                      {files.length === 1 ? "Image" : "Images"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {fullScreen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={() => setFullScreenImage(null)}
            className="absolute top-5 right-5 text-white"
          >
            ✕
          </button>

          <img
            src={fullScreen.url}
            alt={fullScreen.title}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      )}
    </div>
  );
}
