import { memo, useMemo } from "react";
import { FormFieldLayout, FormImageInput, ImageItem } from "@/components/form";
import { usePropertyImagesInput } from "@/entities/properties-sale-rent";
import { cn } from "@/modules/shadcn";
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
      <FormImageInput
        inputId={inputId}
        images={displayImages}
        onImagesChange={handleImagesChange}
        maxImages={30}
        arialInvalid={!!error}
      />
    </FormFieldLayout>
  );
});
