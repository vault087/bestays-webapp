"use client";

import { memo, useRef, useCallback } from "react";
import { ImageItem } from "@/components/form";
import { PropertyImage } from "./image";
import { ImageAddButton } from "./image-add-button";

export const CompactImagesView = memo(function CompactImagesView({
  images,
  onImagesChange,
  onAddFile,
  maxImages,
  setCover,
}: {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  onAddFile: (file: File) => void;
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

      // Use onAddFile for each file instead of manually creating ObjectURLs
      filesToProcess
        .filter((file) => file.type.startsWith("image/"))
        .forEach((file) => {
          onAddFile(file);
        });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [images.length, maxImages, onAddFile],
  );

  const handleRemoveImage = useCallback(
    (index: number) => {
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    },
    [images, onImagesChange],
  );

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4">
      {/* Cover Image - Can scroll out */}
      {coverImage && (
        <div className="flex-shrink-0">
          <PropertyImage image={coverImage} onRemove={() => handleRemoveImage(0)} isCover={true} />
        </div>
      )}

      {/* Add Button - Becomes sticky when reaching left */}
      {images.length < maxImages && (
        <div className="bg-background sticky left-0 z-10 flex-shrink-0">
          <ImageAddButton remainingCount={remainingCount} onClick={() => fileInputRef.current?.click()} />
        </div>
      )}

      {/* Thumbnail Images */}
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

      {/* Hidden File Input */}
      <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
    </div>
  );
});
