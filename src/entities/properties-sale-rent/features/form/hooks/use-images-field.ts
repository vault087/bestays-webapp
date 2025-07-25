"use client";
import { useCallback, useId } from "react";
import { generateTemporarySerialId } from "@/entities/common";
import { DBImage } from "@/entities/media/types/image.type";
import { usePropertyFormStore, usePropertyFormStoreActions } from "@/entities/properties-sale-rent";

// Input hook for property images using slice management
export function usePropertyImagesInput(): {
  inputId: string;
  images: DBImage[]; // Return as DBImage for UI compatibility
  onImagesChange: (images: DBImage[]) => void;
  onAddImage: (image: DBImage) => void;
  onAddFile: (file: File) => void; // New method for file uploads
  onRemoveImage: (index: number) => void;
  onReorderImages: (fromIndex: number, toIndex: number) => void;
  error?: string;
} {
  const inputId = useId();
  const { addDBImages, addImage, deleteImage, reorderImages, refreshImages } = usePropertyFormStoreActions();
  // Subscribe to slice state changes for reactive updates
  const allImages = usePropertyFormStore((state) =>
    Object.values(state.images).map((image) => ({
      ...image,
      id: generateTemporarySerialId(),
      is_new: false,
    })),
  );

  // Convert to DBImage format for UI compatibility
  const images: DBImage[] = allImages.map((img) => ({
    url: img.url,
    color: img.color,
    alt: img.alt,
  }));

  // Handle bulk change (for compatibility with existing UI)
  const onImagesChange = useCallback(
    (newImages: DBImage[]) => {
      // Clear existing and add new ones
      // Note: This is mainly for compatibility - prefer individual operations
      refreshImages(newImages);
    },
    [refreshImages],
  );

  // Add existing DB image
  const onAddImage = useCallback(
    (image: DBImage) => {
      addDBImages([image]);
    },
    [addDBImages],
  );

  // Add new file upload
  const onAddFile = useCallback(
    (file: File) => {
      addImage(file);
    },
    [addImage],
  );

  // Remove image by index
  const onRemoveImage = useCallback(
    (index: number) => {
      const imageToRemove = allImages[index];
      if (imageToRemove) {
        deleteImage(imageToRemove.id);
      }
    },
    [allImages, deleteImage],
  );

  // Reorder images
  const onReorderImages = useCallback(
    (fromIndex: number, toIndex: number) => {
      reorderImages(fromIndex, toIndex);
    },
    [reorderImages],
  );

  const error = undefined;

  return {
    inputId,
    images,
    onImagesChange,
    onAddImage,
    onAddFile,
    onRemoveImage,
    onReorderImages,
    error,
  };
}
