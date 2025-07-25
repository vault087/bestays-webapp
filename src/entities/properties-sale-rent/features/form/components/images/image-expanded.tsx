"use client";

import { Expand, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useCallback, memo, useState, useEffect } from "react";
import { MutableImage } from "@/entities/media/types/image.type";
import { Button } from "@/modules/shadcn/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/modules/shadcn/components/ui/dialog";
import { PropertyImage } from "./image";
import { ImageAddButton } from "./image-add-button";

export const ImageFieldExpandDialog = memo(function ImageFieldExpandDialog({
  mutableImages,
  onMutableImagesChange,
  onAddFile,
  onSave,
  maxImages,
  setCover,
  isOpen,
  onOpenChange,
  shouldAutoSelectFile,
  onAutoSelectFileUsed,
}: {
  mutableImages: MutableImage[];
  onMutableImagesChange: (images: MutableImage[]) => void;
  onAddFile: (file: File) => void;
  onSave: () => Promise<void>;
  maxImages: number;
  setCover: (index: number) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shouldAutoSelectFile: boolean;
  onAutoSelectFileUsed: () => void;
}) {
  const t = useTranslations("Properties.fields.images");
  const title = t("title");
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" onClick={() => {}}>
          <Expand size={16} className="text-muted-foreground/80" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <ExpandedImagesView
          mutableImages={mutableImages}
          onMutableImagesChange={onMutableImagesChange}
          onAddFile={onAddFile}
          onSave={onSave}
          maxImages={maxImages}
          setCover={setCover}
          onClose={() => onOpenChange(false)}
          shouldAutoSelectFile={shouldAutoSelectFile}
          onAutoSelectFileUsed={onAutoSelectFileUsed}
        />
      </DialogContent>
    </Dialog>
  );
});

export const ExpandedImagesView = memo(function ExpandedImagesView({
  mutableImages,
  onMutableImagesChange,
  onAddFile,
  onSave,
  maxImages,
  setCover,
  onClose,
  shouldAutoSelectFile,
  onAutoSelectFileUsed,
}: {
  mutableImages: MutableImage[];
  onMutableImagesChange: (images: MutableImage[]) => void;
  onAddFile: (file: File) => void;
  onSave: () => Promise<void>;
  maxImages: number;
  setCover: (index: number) => void;
  onClose?: () => void;
  shouldAutoSelectFile: boolean;
  onAutoSelectFileUsed: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const hasTriggeredAutoSelect = useRef(false);
  const coverImage = mutableImages[0];
  const otherImages = mutableImages.slice(1);

  const remainingCount = Math.max(0, maxImages - mutableImages.length);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const remainingSlots = maxImages - mutableImages.length;
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
    [mutableImages.length, maxImages, onAddFile],
  );

  const handleRemoveImage = useCallback(
    (index: number) => {
      const newImages = mutableImages.filter((_, i) => i !== index);
      onMutableImagesChange(newImages);
    },
    [mutableImages, onMutableImagesChange],
  );

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await onSave();
      onClose?.();
    } catch (error) {
      console.error("Failed to save images:", error);
    } finally {
      setIsSaving(false);
    }
  }, [onSave, onClose]);

  const handleSetCover = useCallback(
    (index: number) => {
      setCover(index);
    },
    [setCover],
  );

  const t = useTranslations("Properties.fields.images");
  const title = t("title");

  const tCommon = useTranslations("Common");

  // Check if there are any changes to save
  const hasUnsavedChanges = mutableImages.some((img) => img.is_new);

  useEffect(() => {
    if (shouldAutoSelectFile && fileInputRef.current && !hasTriggeredAutoSelect.current) {
      hasTriggeredAutoSelect.current = true;
      onAutoSelectFileUsed(); // Reset flag immediately
      // Small delay to ensure the dialog is fully rendered
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 100);
    }
  }, [shouldAutoSelectFile, onAutoSelectFileUsed]);

  // Reset auto-select tracking when dialog closes
  useEffect(() => {
    if (!shouldAutoSelectFile) {
      hasTriggeredAutoSelect.current = false;
    }
  }, [shouldAutoSelectFile]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">
          {tCommon("image.uploaded", { count: mutableImages.length, max: maxImages })}
        </p>
      </div>

      {/* q-Column Grid Layout */}
      <div className="grid min-h-[400px] grid-cols-2 gap-6">
        {/* Column 2: Other Images Grid */}
        <div className="space-y-2">
          <div className="grid max-h-[400px] grid-cols-3 gap-2 overflow-y-auto">
            {/* Add Images */}
            {mutableImages.length < maxImages && (
              <ImageAddButton size="md" remainingCount={remainingCount} onClick={() => fileInputRef.current?.click()} />
            )}

            {otherImages.map((image, index) => (
              <div key={image.id} className="group relative">
                <PropertyImage
                  image={image}
                  onRemove={() => handleRemoveImage(index + 1)}
                  isCover={false}
                  setCover={() => handleSetCover(index + 1)}
                  size="md"
                />
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                  <ImageOrderNumber index={index + 1} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 1: Cover Image */}
        <div className="flex flex-col justify-between space-y-2">
          {coverImage ? (
            <PropertyImage size="lg" image={coverImage} onRemove={() => handleRemoveImage(0)} isCover={true} />
          ) : (
            <div className="border-muted-foreground/25 flex aspect-[4/3] items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center">
                <div className="text-muted-foreground text-sm select-none">{tCommon("image.noCover")}</div>
              </div>
            </div>
          )}
          <div className="flex flex-row items-center justify-around space-y-2">
            <Button variant="outline" size="lg" onClick={handleSave} disabled={isSaving || !hasUnsavedChanges}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Images"}
            </Button>
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

function ImageOrderNumber({ index }: { index: number }) {
  return (
    <div className="bg-foreground/40 text-background/80 flex h-8 w-8 items-center justify-center rounded-full text-sm opacity-60 select-none group-hover:opacity-80">
      {index + 1}
    </div>
  );
}
