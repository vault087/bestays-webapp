"use client";

import { Expand } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useCallback, memo } from "react";
import { ImageItem } from "@/components/form";
import { Button } from "@/modules/shadcn/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/modules/shadcn/components/ui/dialog";
import { PropertyImage } from "./image";
import { ImageAddButton } from "./image-add-button";

export const ImageFieldExpandDialog = memo(function ImageFieldExpandDialog({
  images,
  onImagesChange,
  onAddFile,
  maxImages,
  setCover,
}: {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  onAddFile: (file: File) => void;
  maxImages: number;
  setCover: (index: number) => void;
}) {
  const t = useTranslations("PropertiesSaleRent.fields.images");
  const title = t("title");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" onClick={() => {}}>
          <Expand size={16} className="text-muted-foreground/80" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <ExpandedImagesView images={images} onImagesChange={onImagesChange} onAddFile={onAddFile} maxImages={maxImages} setCover={setCover} />
      </DialogContent>
    </Dialog>
  );
});

export const ExpandedImagesView = memo(function ExpandedImagesView({
  images,
  onImagesChange,
  onAddFile,
  maxImages,
  setCover,
}: {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  onAddFile: (file: File) => void;
  maxImages: number;
  setCover: (index: number) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverImage = images[0];
  const otherImages = images.slice(1);

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

  const t = useTranslations("PropertiesSaleRent.fields.images");
  const title = t("title");

  const tCommon = useTranslations("Common");

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">
          {tCommon("image.uploaded", { count: images.length, max: maxImages })}
        </p>
      </div>

      {/* q-Column Grid Layout */}
      <div className="grid min-h-[400px] grid-cols-2 gap-6">
        {/* Column 1: Cover Image */}
        <div className="flex flex-col space-y-2">
          {coverImage ? (
            <PropertyImage size="lg" image={coverImage} onRemove={() => handleRemoveImage(0)} isCover={true} />
          ) : (
            <div className="border-muted-foreground/25 flex aspect-[4/3] items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center">
                <div className="text-muted-foreground text-sm select-none">{tCommon("image.noCover")}</div>
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Other Images Grid */}
        <div className="space-y-2">
          <div className="grid max-h-[400px] grid-cols-3 gap-2 overflow-y-auto">
            {/* Add Images */}
            {images.length < maxImages && (
              <ImageAddButton size="md" remainingCount={remainingCount} onClick={() => fileInputRef.current?.click()} />
            )}

            {otherImages.map((image, index) => (
              <PropertyImage
                key={index + 1}
                image={image}
                onRemove={() => handleRemoveImage(index + 1)}
                isCover={false}
                setCover={() => setCover(index + 1)}
                size="md"
              />
            ))}
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
});
