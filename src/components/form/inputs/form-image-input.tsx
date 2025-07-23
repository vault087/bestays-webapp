"use client";

import { PlusIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { memo, useCallback, useRef } from "react";
import { Button } from "@/modules/shadcn/components/ui/button";
import { cn } from "@/modules/shadcn/utils/cn";

export type ImageItem = {
  url: string;
  color?: string | null;
  description?: string | null;
};

export const FormImageInput = memo(function FormImageInput({
  inputId,
  images,
  onImagesChange,
  maxImages = 30,
  arialInvalid = false,
  className,
  accept = "image/*",
}: {
  inputId: string;
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  maxImages?: number;
  arialInvalid?: boolean;
  className?: string;
  accept?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const remainingSlots = maxImages - images.length;
      const filesToProcess = files.slice(0, remainingSlots);

      const newImages: ImageItem[] = [];
      let processed = 0;

      filesToProcess.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (event) => {
            newImages.push({
              url: event.target?.result as string,
              color: null,
              description: null,
            });
            processed++;
            if (processed === filesToProcess.length) {
              onImagesChange([...images, ...newImages]);
            }
          };
          reader.readAsDataURL(file);
        }
      });

      // Reset input
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

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const canUpload = images.length < maxImages;
  const mainImage = images[0];
  const thumbnailImages = images.slice(1);

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      {/* Image Display Grid */}
      {images.length > 0 ? (
        <div className="flex gap-4">
          {/* Main Image */}
          <div className="relative min-h-[300px] flex-1">
            {mainImage && (
              <div className="relative h-full">
                <Image
                  src={mainImage.url}
                  alt={mainImage.description || `Image 1`}
                  fill
                  className="rounded-lg object-cover"
                  unoptimized
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => handleRemoveImage(0)}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {thumbnailImages.length > 0 && (
            <div className="flex w-32 flex-col gap-2">
              <div className="grid max-h-[300px] grid-cols-1 gap-2 overflow-y-auto">
                {thumbnailImages.map((image, index) => (
                  <div key={index + 1} className="relative aspect-square">
                    <Image
                      src={image.url}
                      alt={image.description || `Image ${index + 2}`}
                      fill
                      className="rounded-md object-cover"
                      unoptimized
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => handleRemoveImage(index + 1)}
                    >
                      <XIcon className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="border-muted-foreground/25 flex min-h-[300px] items-center justify-center rounded-lg border-2 border-dashed">
          <div className="space-y-2 text-center">
            <div className="text-muted-foreground text-sm">No images uploaded</div>
          </div>
        </div>
      )}

      {/* Upload Button */}
      {canUpload && (
        <div className="flex justify-center">
          <Button type="button" variant="outline" onClick={handleUploadClick} className="gap-2">
            <PlusIcon className="h-4 w-4" />
            Upload Images ({images.length}/{maxImages})
          </Button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        multiple
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        aria-invalid={arialInvalid}
        aria-describedby={arialInvalid ? `${inputId}-error` : `${inputId}-description`}
      />

      {/* Image Count Info */}
      <p
        id={`${inputId}-description`}
        className="text-muted-foreground text-center text-xs"
        role="status"
        aria-live="polite"
      >
        {images.length} of {maxImages} images
      </p>
    </div>
  );
});
