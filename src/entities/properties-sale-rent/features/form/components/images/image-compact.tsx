"use client";

import { memo, useCallback } from "react";
import { DBImage } from "@/entities/media/types/image.type";
import { PropertyImage } from "./image";
import { ImageAddButton } from "./image-add-button";

export const CompactImagesView = memo(function CompactImagesView({
  images,
  onOpenExpanded,
  setCover,
  maxImages,
}: {
  images: DBImage[];
  onOpenExpanded: () => void;
  setCover: (index: number) => void;
  maxImages: number;
}) {
  const coverImage = images[0];
  const thumbnails = images.slice(1); // Show all thumbnails in compact view
  const remainingCount = Math.max(0, maxImages - images.length);

  const handleSetCover = useCallback(
    (index: number) => {
      setCover(index);
    },
    [setCover],
  );

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4">
      {/* Cover Image - Can scroll out */}
      {coverImage && (
        <div className="flex-shrink-0">
          <PropertyImage image={coverImage} isReadOnly={true} isCover={true} />
        </div>
      )}

      {/* Add Button - Becomes sticky when reaching left */}
      {images.length < maxImages && (
        <div className="bg-background sticky left-0 z-10 flex-shrink-0">
          <ImageAddButton remainingCount={remainingCount} onClick={onOpenExpanded} />
        </div>
      )}

      {/* Thumbnail Images */}
      {thumbnails.map((image, index) => (
        <div key={index + 1} className="relative flex-shrink-0">
          <PropertyImage setCover={() => handleSetCover(index + 1)} image={image} isReadOnly={true} isCover={false} />
        </div>
      ))}
    </div>
  );
});
