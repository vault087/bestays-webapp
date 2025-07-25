import { MutableImage } from "@/entities/media/types/image.type";
import { supabase } from "@/modules/supabase/clients/client";

export interface ImageUploadResult {
  url: string;
  path: string;
  error?: string;
}

export interface BatchImageUploadResult {
  success: ImageUploadResult[];
  failed: Array<{ image: MutableImage; error: string }>;
}

/**
 * Upload a single image to Supabase Storage
 */
export async function uploadImageToStorage(
  file: File,
  bucketName: string = "property-images",
  folderPath?: string,
): Promise<ImageUploadResult> {
  try {
    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

    // Upload to Supabase Storage
    const { error } = await supabase.storage.from(bucketName).upload(filePath, file, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      return { url: "", path: "", error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown upload error";
    return { url: "", path: "", error: errorMessage };
  }
}

/**
 * Upload multiple images to Supabase Storage
 */
export async function uploadImagesBatch(
  images: MutableImage[],
  bucketName: string = "property-images",
  folderPath?: string,
): Promise<BatchImageUploadResult> {
  const results: BatchImageUploadResult = {
    success: [],
    failed: [],
  };

  // Filter only new images that need upload
  const newImages = images.filter((img) => img.is_new && img.file);

  if (newImages.length === 0) {
    // No new images to upload, return existing URLs
    const existingImages = images.filter((img) => !img.is_new);
    results.success = existingImages.map((img) => ({
      url: img.url,
      path: img.url, // Use URL as path for existing images
    }));
    return results;
  }

  // Upload new images in parallel
  const uploadPromises = newImages.map(async (image) => {
    if (!image.file) {
      return { image, error: "No file found" };
    }

    const result = await uploadImageToStorage(image.file, bucketName, folderPath);

    if (result.error) {
      return { image, error: result.error };
    }

    return { image, result };
  });

  const uploadResults = await Promise.all(uploadPromises);

  // Process results
  uploadResults.forEach(({ image, result, error }) => {
    if (error) {
      results.failed.push({ image, error });
    } else if (result) {
      results.success.push(result);
    }
  });

  // Add existing images to success results
  const existingImages = images.filter((img) => !img.is_new);
  results.success.push(
    ...existingImages.map((img) => ({
      url: img.url,
      path: img.url,
    })),
  );

  return results;
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteImageFromStorage(
  path: string,
  bucketName: string = "property-images",
): Promise<{ error?: string }> {
  try {
    const { error } = await supabase.storage.from(bucketName).remove([path]);

    if (error) {
      return { error: error.message };
    }

    return {};
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown delete error";
    return { error: errorMessage };
  }
}
