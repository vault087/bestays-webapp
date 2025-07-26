import { uploadImagesBatch } from "@/entities/media/libs/image-upload.service";
import { DBImage, MutableImage, PROPERTY_IMAGES_BUCKET } from "@/entities/media/types/image.type";

export interface PropertyImageUploadResult {
  success: boolean;
  images: DBImage[];
  errors: string[];
}

/**
 * Upload property images and return DB-ready format
 */
export async function uploadPropertyImages(
  mutableImages: MutableImage[],
  propertyId?: string,
): Promise<PropertyImageUploadResult> {
  try {
    // Create folder path based on property ID or use timestamp
    const folderPath = propertyId ? `properties/${propertyId}` : `properties/${Date.now()}`;

    // Upload images to storage
    const uploadResult = await uploadImagesBatch(mutableImages, PROPERTY_IMAGES_BUCKET, folderPath);

    // Convert successful uploads to DB format
    const dbImages: DBImage[] = uploadResult.success.map((result) => ({
      url: result.url,
      color: null, // TODO: Extract color if needed
      alt: null, // TODO: Extract alt text if needed
    }));

    // Collect errors
    const errors = uploadResult.failed.map(
      (failure) => `Failed to upload ${failure.image.name || "image"}: ${failure.error}`,
    );

    return {
      success: uploadResult.failed.length === 0,
      images: dbImages,
      errors,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown upload error";
    return {
      success: false,
      images: [],
      errors: [errorMessage],
    };
  }
}
