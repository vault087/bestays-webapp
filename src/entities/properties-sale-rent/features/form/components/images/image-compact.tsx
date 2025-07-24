"use client";

import { memo, useRef, useCallback } from "react";
import { ImageItem } from "@/components/form";
import { PropertyImage } from "./image";
import { ImageAddButton } from "./image-add-button";

export const CompactImagesView = memo(function CompactImagesView({
  images,
  onImagesChange,
  maxImages,
  setCover,
}: {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  setCover: (index: number) => void;
  maxImages: number;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverImage = images[0];
  const thumbnails = images.slice(1); // Show all thumbnails in compact view
  const remainingCount = Math.max(0, maxImages - images.length);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const remainingSlots = maxImages - images.length;
      const filesToProcess = files.slice(0, remainingSlots);

      const newImages: ImageItem[] = filesToProcess
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => ({
          url: URL.createObjectURL(file),
          color: null,
          description: null,
        }));

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [images, maxImages, onImagesChange],
  );

  const handleRemoveImage = useCallback(
    (index: number) => {
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    },
    [images, onImagesChange],
  );

  return (
    <div className="flex items-center pb-2">
      {/* Fixed Left Section - Cover Image and Add Button */}
      <div className="flex flex-shrink-0 items-center gap-3">
        {/* Cover Image - Sticky */}
        {coverImage && <PropertyImage image={coverImage} onRemove={() => handleRemoveImage(0)} isCover={true} />}

        {/* Add Button - Sticky */}
        {images.length < maxImages && (
          <ImageAddButton remainingCount={remainingCount} onClick={() => fileInputRef.current?.click()} />
        )}
      </div>

      {/* Scrollable Right Section - Thumbnails */}
      {thumbnails.length > 0 && (
        <div className="ml-3 flex items-center gap-3 overflow-x-auto">
          {thumbnails.map((image, index) => (
            <div key={index + 1} className="relative flex-shrink-0">
              <PropertyImage
                setCover={() => setCover(index + 1)}
                image={image}
                onRemove={() => handleRemoveImage(index + 1)}
                isCover={false}
              />
            </div>
          ))}
        </div>
      )}

      {/* Hidden File Input */}
      <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
    </div>
  );
});
