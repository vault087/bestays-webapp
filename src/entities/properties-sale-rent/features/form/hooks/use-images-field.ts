"use client";
import { useCallback, useId, useState } from "react";
import { z } from "zod";
import { DBImageSchema } from "@/entities/media/types/image.type";
import { usePropertyFormStaticStore, usePropertyFormStoreActions } from "@/entities/properties-sale-rent";

type DBImage = z.infer<typeof DBImageSchema>;

// Input hook for MutableProperty images field
export function usePropertyImagesInput(): {
  inputId: string;
  images: DBImage[];
  onImagesChange: (images: DBImage[]) => void;
  onAddImage: (image: DBImage) => void;
  onRemoveImage: (index: number) => void;
  onReorderImages: (fromIndex: number, toIndex: number) => void;
  error?: string;
} {
  const inputId = useId();

  const { property } = usePropertyFormStaticStore();
  const { updateProperty } = usePropertyFormStoreActions();

  const [currentImages, setCurrentImages] = useState<DBImage[]>(property.images || []);

  // Handle change
  const onImagesChange = useCallback(
    (images: DBImage[]) => {
      setCurrentImages(images);
      updateProperty((draft) => {
        draft.images = images;
      });
    },
    [updateProperty],
  );

  const onAddImage = useCallback(
    (image: DBImage) => {
      const newImages = [...currentImages, image];
      onImagesChange(newImages);
    },
    [currentImages, onImagesChange],
  );

  const onRemoveImage = useCallback(
    (index: number) => {
      const newImages = currentImages.filter((_, i) => i !== index);
      onImagesChange(newImages);
    },
    [currentImages, onImagesChange],
  );

  const onReorderImages = useCallback(
    (fromIndex: number, toIndex: number) => {
      const newImages = [...currentImages];
      const [removed] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, removed);
      onImagesChange(newImages);
    },
    [currentImages, onImagesChange],
  );

  const error = undefined;

  return {
    inputId,
    images: currentImages,
    onImagesChange,
    onAddImage,
    onRemoveImage,
    onReorderImages,
    error,
  };
}
