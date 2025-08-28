// hooks/useImageUploader.ts
import { uploadImageToCloudinarySigned } from "@/services/cloudinary/cloudinary";
import { useState } from "react";

export interface UploadedImage {
  id: number;
  file?: File;
  preview: string;
  cloudinaryUrl: string;
  isUploading: boolean;
}

export const useImageUploader = (folder: string, maxImages = 10) => {
  const [images, setImages] = useState<UploadedImage[]>([]);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (files.length > remainingSlots) {
      alert(`You can only upload ${remainingSlots} more image(s). Max is ${maxImages}.`);
      return;
    }

    const newImages: UploadedImage[] = Array.from(files).map((file, idx) => ({
      id: Date.now() + idx,
      file,
      preview: URL.createObjectURL(file),
      isUploading: true,
      cloudinaryUrl: "",
    }));

    setImages((prev) => [...prev, ...newImages]);

    for (const img of newImages) {
      try {
        const publicId = await uploadImageToCloudinarySigned(img.file!, folder);
        if (publicId) {
          setImages((prev) =>
            prev.map((i) =>
              i.id === img.id
                ? {
                    ...i,
                    cloudinaryUrl: `https://res.cloudinary.com/${import.meta.env.VITE_CLOUD_NAME}/image/upload/${publicId}`,
                    isUploading: false,
                  }
                : i
            )
          );
        }
      } catch (err) {
        console.error("Upload failed", err);
        setImages((prev) => prev.filter((i) => i.id !== img.id));
      }
    }
  };

  const removeImage = (id: number) => {
    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  return { images, handleImageUpload, removeImage, setImages };
};
