"use client";

import { Expand, ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { memo, useMemo, useRef, useCallback } from "react";
import { FormFieldLayout, ImageItem } from "@/components/form";
import { FormFieldLayoutToolbar } from "@/components/form/layout/form-field-layout-toolbar";
import { usePropertyImagesInput } from "@/entities/properties-sale-rent";
import { Button } from "@/modules/shadcn/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/modules/shadcn/components/ui/dialog";
import { useDebugRender } from "@/utils/use-debug-render";
import { PropertyImage, PropertyBigImage } from "./images/image";

export const PropertyImagesInput = memo(function PropertyImagesInput({ className }: { className?: string }) {
  const { images, onImagesChange, error } = usePropertyImagesInput();

  useDebugRender("PropertyImagesInput");

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
      return [
        { url: "/bg/bg1.jpg", color: null, alt: "Beach villa background" },
        { url: "/bg/bg2.jpg", color: null, alt: "Tropical view background" },
        { url: "/bg/bg3.jpg", color: null, alt: "Coastal area background" },
      ];
    }
    return formImages;
  }, [formImages]);

  return (
    <FormFieldLayout
      title="Property Images"
      description="Upload up to 30 images. The first image will be used as the main cover photo."
      error={error}
      className={className}
      config={{ focus_ring: true }}
    >
      <FormFieldLayoutToolbar>
        <ImageFieldExpandDialog images={displayImages} onImagesChange={handleImagesChange} maxImages={30} />
      </FormFieldLayoutToolbar>

      {/* Compact View */}
      <CompactImagesView images={displayImages} onImagesChange={handleImagesChange} maxImages={30} />
    </FormFieldLayout>
  );
});

function CompactImagesView({
  images,
  onImagesChange,
  maxImages,
}: {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
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
          {coverImage && <PropertyImage image={image} onRemove={() => handleRemoveImage(index + 1)} isCover={false} />}
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
}

function ImageFieldExpandDialog({
  images,
  onImagesChange,
  maxImages,
}: {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  maxImages: number;
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
        <ExpandedImagesView images={images} onImagesChange={onImagesChange} maxImages={maxImages} />
      </DialogContent>
    </Dialog>
  );
}

function ExpandedImagesView({
  images,
  onImagesChange,
  maxImages,
}: {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  maxImages: number;
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
            <PropertyBigImage image={coverImage} onRemove={() => handleRemoveImage(0)} isCover={true} />
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
              <div key={index + 1} className="group relative aspect-square rounded-md">
                <div className="flex h-full w-full overflow-clip rounded-md">
                  <div className="relative h-full w-full transition-transform duration-200 group-hover:scale-105">
                    <Image
                      src={image.url}
                      alt={`Image ${index + 2}`}
                      fill
                      className="rounded-md object-cover"
                      unoptimized
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="xs"
                  className="bg-foreground text-background absolute top-1.5 right-1.5 h-4 w-4 rounded-full p-0 opacity-20 group-hover:scale-115 group-hover:opacity-100"
                  onClick={() => handleRemoveImage(index + 1)}
                >
                  <X className="!h-3 !w-3" />
                </Button>
              </div>
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
}
