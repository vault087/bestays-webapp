import { Property } from "@/entities/properties-sale-rent";
import { loadAllProperties } from "@/entities/properties-sale-rent/libs";

export type GetPropertiesActionResponse = Promise<{
  properties: Record<number, Property>;
  error: string | null;
}>;

/**
 * React Server Component compatible function to load dictionaries
 * This is designed to be called during server rendering and passed as a promise
 */
export async function getPropertiesAction(): GetPropertiesActionResponse {
  try {
    return await loadAllProperties();
  } catch (error) {
    console.error("Failed to load dictionaries:", error);

    return {
      properties: {},
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
