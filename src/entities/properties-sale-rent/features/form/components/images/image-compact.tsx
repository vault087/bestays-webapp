"use client";

import { ImagePlus } from "lucide-react";
import { memo, useRef, useCallback } from "react";
import { ImageItem } from "@/components/form";
import { Button } from "@/modules/shadcn/components/ui/button";
import { PropertyImage } from "./image";

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
  const thumbnails = images.slice(1, 5); // Show max 4 thumbnails in compact view
  const remainingCount = Math.max(0, images.length - 5);

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
    <div className="flex items-center gap-3 overflow-x-auto pb-2">
      {/* Cover Image - Sticky */}
      {coverImage && <PropertyImage image={coverImage} onRemove={() => handleRemoveImage(0)} isCover={true} />}

      {/* Thumbnail Images */}
      {thumbnails.map((image, index) => (
        <div key={index + 1} className="relative flex-shrink-0">
          {coverImage && (
            <PropertyImage
              setCover={() => setCover(index + 1)}
              image={image}
              onRemove={() => handleRemoveImage(index + 1)}
              isCover={false}
            />
          )}
        </div>
      ))}

      {/* Remaining Count Indicator */}
      {remainingCount > 0 && (
        <div className="bg-muted flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-md">
          <span className="text-muted-foreground text-sm">+{remainingCount}</span>
        </div>
      )}

      {/* Add Button */}
      {images.length < maxImages && (
        <Button
          type="button"
          variant="outline"
          className="h-20 w-20 flex-shrink-0 border-dashed"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus className="!h-6 !w-6" />
        </Button>
      )}

      {/* Hidden File Input */}
      <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
    </div>
  );
});
