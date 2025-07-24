"use client";
import { useCallback, useId } from "react";
import { useStore } from "zustand";
import { DBImage } from "@/entities/media/types/image.type";
import { usePropertyFormStoreContext } from "@/entities/properties-sale-rent";

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
  const store = usePropertyFormStoreContext();

  // Subscribe to slice state changes for reactive updates
  const allImages = useStore(store, (state) => state.getAllImagesOrdered());
  
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
      store.getState().clearImages();
      store.getState().addDBImages(newImages);
    },
    [store],
  );

  // Add existing DB image
  const onAddImage = useCallback(
    (image: DBImage) => {
      store.getState().addDBImages([image]);
    },
    [store],
  );

  // Add new file upload
  const onAddFile = useCallback(
    (file: File) => {
      store.getState().addImage(file);
    },
    [store],
  );

  // Remove image by index
  const onRemoveImage = useCallback(
    (index: number) => {
      const imageToRemove = allImages[index];
      if (imageToRemove) {
        store.getState().deleteImage(imageToRemove.id);
      }
    },
    [allImages, store],
  );

  // Reorder images
  const onReorderImages = useCallback(
    (fromIndex: number, toIndex: number) => {
      store.getState().reorderImages(fromIndex, toIndex);
    },
    [store],
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
