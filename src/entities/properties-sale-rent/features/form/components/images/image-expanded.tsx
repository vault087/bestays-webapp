"use client";

import { Expand, ImagePlus } from "lucide-react";
import { useRef, useCallback, memo } from "react";
import { ImageItem } from "@/components/form";
import { Button } from "@/modules/shadcn/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/modules/shadcn/components/ui/dialog";
import { PropertyImage } from "./image";

export const ImageFieldExpandDialog = memo(function ImageFieldExpandDialog({
  images,
  onImagesChange,
  maxImages,
  setCover,
}: {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  maxImages: number;
  setCover: (index: number) => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" onClick={() => {}}>
          <Expand size={16} className="text-muted-foreground/80" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogTitle className="sr-only">Property Images Editor</DialogTitle>
        <ExpandedImagesView images={images} onImagesChange={onImagesChange} maxImages={maxImages} setCover={setCover} />
      </DialogContent>
    </Dialog>
  );
});

export const ExpandedImagesView = memo(function ExpandedImagesView({
  images,
  onImagesChange,
  maxImages,
  setCover,
}: {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  maxImages: number;
  setCover: (index: number) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverImage = images[0];
  const otherImages = images.slice(1);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const remainingSlots = maxImages - images.length;
      const filesToProcess = files.slice(0, remainingSlots);

      const newImageItems: ImageItem[] = filesToProcess
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => ({
          url: URL.createObjectURL(file),
          color: null,
          description: null,
        }));

      if (newImageItems.length > 0) {
        onImagesChange([...images, ...newImageItems]);
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
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Property Images</h3>
        <p className="text-muted-foreground text-sm">
          {images.length} of {maxImages} images uploaded
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
                <div className="text-muted-foreground text-sm">No cover image</div>
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Other Images Grid */}
        <div className="space-y-2">
          <div className="grid max-h-[400px] grid-cols-3 gap-2 overflow-y-auto">
            {/* Add Images */}
            <div>
              {images.length < maxImages ? (
                <div className="flex items-center justify-center">
                  <Button
                    type="button"
                    variant="text"
                    className="flex h-auto items-center justify-center"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center justify-center space-y-2 border-dashed">
                      {/* <div className="h-12 w-12 bg-amber-500"> */}
                      <ImagePlus className="text-muted-foreground !h-12 !w-12" />
                      {/* </div> */}
                      <span className="text-lg">Upload Images</span>
                      <span className="text-muted-foreground text-xs">{maxImages - images.length} remaining</span>
                    </div>
                  </Button>
                </div>
              ) : (
                <div className="border-muted-foreground/25 flex aspect-[4/3] items-center justify-center rounded-lg border">
                  <div className="text-center">
                    <div className="text-muted-foreground text-sm">Maximum images reached</div>
                  </div>
                </div>
              )}
            </div>

            {otherImages.map((image, index) => (
              <PropertyImage
                key={index + 1}
                image={image}
                onRemove={() => handleRemoveImage(index + 1)}
                isCover={false}
                setCover={() => setCover(index + 1)}
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
