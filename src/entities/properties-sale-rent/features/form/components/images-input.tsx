"use client";

import { useTranslations } from "next-intl";
import { memo, useCallback, useState } from "react";
import { FormFieldLayout } from "@/components/form";
import { FormFieldLayoutToolbar } from "@/components/form/layout/form-field-layout-toolbar";
import { generateTemporarySerialId } from "@/entities/common";
import { MutableImage } from "@/entities/media/types/image.type";
import {
  usePropertyFormStore,
  usePropertyFormStoreContext,
  usePropertyFormStoreActions,
} from "@/entities/properties-sale-rent";
import { updateProperty } from "@/entities/properties-sale-rent/libs/actions/property";
import { uploadPropertyImages } from "@/entities/properties-sale-rent/libs/image-upload";
import { PROPERTY_MAX_IMAGES } from "@/entities/properties-sale-rent/types/property.types";
import { ImageFieldExpandDialog, CompactImagesView } from "./images";

export const PropertyImagesInput = memo(function PropertyImagesInput({ className }: { className?: string }) {
  const propertyStore = usePropertyFormStoreContext();
  const images = usePropertyFormStore((state) => state.property.images);
  const { refreshImages } = usePropertyFormStoreActions();
  const maxImages = PROPERTY_MAX_IMAGES;
  const [isExpandedOpen, setIsExpandedOpen] = useState(false);
  const [mutableImages, setMutableImages] = useState<MutableImage[]>([]);
  const [shouldAutoSelectFile, setShouldAutoSelectFile] = useState(false);

  // Initialize mutable images when opening expanded view
  const handleOpenExpanded = useCallback(() => {
    const initialMutableImages: MutableImage[] = (images || []).map((image) => ({
      ...image,
      id: generateTemporarySerialId(), // Generate temporary ID for state management
      is_new: false, // Existing DB images
    }));
    setMutableImages(initialMutableImages);
    setIsExpandedOpen(true);
    setShouldAutoSelectFile(true); // Auto-trigger file selection
  }, [images]);

  // Handle adding new files in expanded view
  const handleAddFile = useCallback((file: File) => {
    const previewUrl = URL.createObjectURL(file);
    const newMutableImage: MutableImage = {
      id: generateTemporarySerialId(),
      url: previewUrl,
      previewUrl,
      file,
      is_new: true,
      uploadedAt: new Date(),
      name: file.name,
      size: file.size,
      color: null,
      alt: null,
    };
    setMutableImages((prev) => [...prev, newMutableImage]);
  }, []);

  // Handle changes to mutable images in expanded view
  const handleMutableImagesChange = useCallback((newMutableImages: MutableImage[]) => {
    setMutableImages(newMutableImages);
  }, []);

  // Reset auto file selection flag
  const handleAutoSelectFileUsed = useCallback(() => {
    setShouldAutoSelectFile(false);
  }, []);

  // Handle saving mutable images back to DB
  const handleSaveImages = useCallback(async () => {
    try {
      // Upload images to Supabase Storage
      const uploadResult = await uploadPropertyImages(mutableImages);

      if (!uploadResult.success) {
        console.error("Image upload failed:", uploadResult.errors);
        // TODO: Show error to user
        return;
      }

      // Clean up object URLs
      mutableImages.forEach((img) => {
        if (img.previewUrl && img.is_new) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });

      // Update the DB images with uploaded URLs
      refreshImages(uploadResult.images);
      const property = propertyStore.getState()?.property;
      updateProperty(property.id, property);

      // Close expanded view
      setIsExpandedOpen(false);
    } catch (error) {
      console.error("Failed to save images:", error);
      // TODO: Show error to user
    }
  }, [mutableImages, refreshImages, propertyStore]);

  // Handle setting cover image in both views
  const setCoverInCompact = useCallback(
    (index: number) => {
      if (images && images.length > 1) {
        const newImages = [...images];
        const [cover] = newImages.splice(index, 1);
        newImages.unshift(cover);
        refreshImages(newImages);
      }
    },
    [images, refreshImages],
  );

  const setCoverInExpanded = useCallback(
    (index: number) => {
      if (mutableImages.length > 1) {
        const newImages = [...mutableImages];
        const [cover] = newImages.splice(index, 1);
        newImages.unshift(cover);
        setMutableImages(newImages);
      }
    },
    [mutableImages],
  );

  const t = useTranslations("Properties.fields.images");

  return (
    <FormFieldLayout
      title={t("title")}
      description={t("description", { maxImages })}
      className={className}
      config={{ focus_ring: true }}
    >
      <FormFieldLayoutToolbar>
        <ImageFieldExpandDialog
          mutableImages={mutableImages}
          onMutableImagesChange={handleMutableImagesChange}
          onAddFile={handleAddFile}
          onSave={handleSaveImages}
          maxImages={maxImages}
          setCover={setCoverInExpanded}
          isOpen={isExpandedOpen}
          onOpenChange={setIsExpandedOpen}
          shouldAutoSelectFile={shouldAutoSelectFile}
          onAutoSelectFileUsed={handleAutoSelectFileUsed}
        />
      </FormFieldLayoutToolbar>

      {/* Compact View - Read-only DB Images */}
      <CompactImagesView
        images={images || []}
        onOpenExpanded={handleOpenExpanded}
        setCover={setCoverInCompact}
        maxImages={maxImages}
      />
    </FormFieldLayout>
  );
});
