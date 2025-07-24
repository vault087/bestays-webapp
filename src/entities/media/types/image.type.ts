import { z } from "zod";
import { DBSerialID } from "@/entities/common";

export const DBImageSchema = z.object({
  url: z.string(),
  color: z.string().nullish(),
  alt: z.string().nullish(),
});

export type DBImage = z.infer<typeof DBImageSchema>;

// Browser-specific image type for form handling
export interface MutableImage extends DBImage {
  id: DBSerialID; // Unique identifier for slice management
  is_new: boolean; // Track if this is a new upload vs existing DB image
  file?: File; // Original file for new uploads
  previewUrl?: string; // Object URL for file preview (needs cleanup)
  uploadedAt?: Date; // Upload timestamp
  name?: string; // Original filename
  size?: number; // File size in bytes
}
