"use client";

import { useTranslations } from "next-intl";
import { memo, useCallback, useMemo } from "react";
import { FormFieldLayout, ImageItem } from "@/components/form";
import { FormFieldLayoutToolbar } from "@/components/form/layout/form-field-layout-toolbar";
import { usePropertyImagesInput } from "@/entities/properties-sale-rent";
import { PROPERTY_MAX_IMAGES } from "@/entities/properties-sale-rent/types/property.types";
import { ImageFieldExpandDialog, CompactImagesView } from "./images";

export const PropertyImagesInput = memo(function PropertyImagesInput({ className }: { className?: string }) {
  const { images, onImagesChange, error } = usePropertyImagesInput();
  const maxImages = PROPERTY_MAX_IMAGES;

  // Convert DBImage to ImageItem format for the form component
  const formImages: ImageItem[] = useMemo(
    () =>
      images.map((img) => ({
        url: img.url,
        color: img.color,
        alt: img.alt,
      })),
    [images],
  );

  // Handle change from form component back to DBImage format
  const handleImagesChange = (newImages: ImageItem[]) => {
    const dbImages = newImages.map((img) => ({
      url: img.url,
      color: img.color || null,
      alt: img.alt || null,
    }));
    onImagesChange(dbImages);
  };

  // Mock data - add 3 background images if no images exist
  const displayImages = useMemo(() => {
    if (formImages.length === 0) {
      return [];
      //   { url: "/bg/bg1.jpg", color: null, alt: "Beach villa background" },
      //   { url: "/bg/bg2.jpg", color: null, alt: "Tropical view background" },
      //   { url: "/bg/bg3.jpg", color: null, alt: "Coastal area background" },
      // ];
    }
    return formImages;
  }, [formImages]);

  const setCover = useCallback(
    (index: number) => {
      const currentCover = images[0];
      const newImages = [...images];
      newImages[0] = newImages[index];
      newImages[index] = currentCover;
      onImagesChange(newImages);
    },
    [images, onImagesChange],
  );

  const t = useTranslations("PropertiesSaleRent.fields.images");
  return (
    <FormFieldLayout
      title={t("title")}
      description={t("description", { maxImages })}
      error={error}
      className={className}
      config={{ focus_ring: true }}
    >
      <FormFieldLayoutToolbar>
        <ImageFieldExpandDialog
          images={displayImages}
          onImagesChange={handleImagesChange}
          maxImages={maxImages}
          setCover={setCover}
        />
      </FormFieldLayoutToolbar>

      {/* Compact View */}
      <CompactImagesView
        images={displayImages}
        onImagesChange={handleImagesChange}
        maxImages={maxImages}
        setCover={setCover}
      />
    </FormFieldLayout>
  );
});
