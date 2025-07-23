"use client";

import { Expand, ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { memo, useMemo, useRef, useCallback } from "react";
import { FormFieldLayout, ImageItem } from "@/components/form";
import {
  FormFieldLayoutToolbar,
  FormFieldLayoutToolbarButton,
} from "@/components/form/layout/form-field-layout-toolbar";
import { usePropertyImagesInput } from "@/entities/properties-sale-rent";
import { cn } from "@/modules/shadcn";
import { Button } from "@/modules/shadcn/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/modules/shadcn/components/ui/dialog";
import { useDebugRender } from "@/utils/use-debug-render";

export const PropertyImagesInput = memo(function PropertyImagesInput({ className }: { className?: string }) {
  const { inputId, images, onImagesChange, error } = usePropertyImagesInput();

  useDebugRender("PropertyImagesInput");

  // Convert DBImage to ImageItem format for the form component
  const formImages: ImageItem[] = useMemo(
    () =>
      images.map((img) => ({
        url: img.url,
        color: img.color,
        description: img.description,
      })),
    [images],
  );

  // Handle change from form component back to DBImage format
  const handleImagesChange = (newImages: ImageItem[]) => {
    const dbImages = newImages.map((img) => ({
      url: img.url,
      color: img.color || null,
      description: img.description || null,
    }));
    onImagesChange(dbImages);
  };

  // Mock data - add 3 background images if no images exist
  const displayImages = useMemo(() => {
    if (formImages.length === 0) {
      return [
        { url: "/bg/bg1.jpg", color: null, description: "Beach villa background" },
        { url: "/bg/bg2.jpg", color: null, description: "Tropical view background" },
        { url: "/bg/bg3.jpg", color: null, description: "Coastal area background" },
      ];
    }
    return formImages;
  }, [formImages]);

  return (
    <FormFieldLayout
      title="Property Images"
      description="Upload up to 30 images. The first image will be used as the main cover photo."
      error={error}
      inputId={inputId}
      className={cn("space-y-4", className)}
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
      {coverImage && (
        <div className="relative flex-shrink-0">
          <div className="relative h-20 w-20 overflow-hidden rounded-md">
            <Image src={coverImage.url} alt="Cover photo" fill className="object-cover" unoptimized />
            <div className="absolute top-1 right-1 rounded bg-green-600 px-1 text-xs text-white">Cover</div>
            <Button
              type="button"
              variant="destructive"
              size="xs"
              className="absolute top-1 left-1 h-5 w-5 p-0"
              onClick={() => handleRemoveImage(0)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Thumbnail Images */}
      {thumbnails.map((image, index) => (
        <div key={index + 1} className="relative flex-shrink-0">
          <div className="relative h-20 w-20 overflow-hidden rounded-md">
            <Image src={image.url} alt={`Image ${index + 2}`} fill className="object-cover" unoptimized />
            <Button
              type="button"
              variant="destructive"
              size="xs"
              className="absolute top-1 right-1 h-5 w-5 p-0"
              onClick={() => handleRemoveImage(index + 1)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
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
        <FormFieldLayoutToolbarButton onClick={() => {}}>
          <Expand size={16} className="text-muted-foreground/80" />
        </FormFieldLayoutToolbarButton>
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
            <div className="group relative aspect-[4/3] overflow-hidden rounded-lg">
              <div className="flex h-full w-full overflow-clip rounded-md">
                <div className="h-full w-full transition-transform duration-200 group-hover:scale-105">
                  <Image src={coverImage.url} alt="Cover photo" fill className="object-cover" unoptimized />
                </div>
              </div>
              <div className="bg-primary text-primary-foreground absolute top-2.5 left-2.5 rounded px-2 py-1 text-xs transition-transform duration-200 select-none group-hover:scale-110">
                Cover
              </div>
              <Button
                type="button"
                variant="destructive"
                size="xs"
                className="bg-foreground text-background absolute top-2 right-2 h-5 w-5 rounded-full p-0 opacity-20 group-hover:scale-115 group-hover:opacity-100"
                onClick={() => handleRemoveImage(0)}
              >
                <X className="!h-4 !w-4" />
              </Button>
            </div>
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
                  <div className="h-full w-full transition-transform duration-200 group-hover:scale-105">
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
