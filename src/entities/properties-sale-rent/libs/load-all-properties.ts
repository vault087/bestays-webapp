import { Property, PROPERTIES_SALE_RENT_TABLE } from "@/entities/properties-sale-rent";
import { supabase } from "@/modules/supabase/clients/client";

export type PropertiesResponse = Promise<{
  properties: Record<string, Property>;
  error: string | null;
}>;
/**
 * Loads all dictionaries and their entries from Supabase
 */
export async function loadAllProperties(): PropertiesResponse {
  try {
    // Fetch dictionaries and entries in parallel
    const propertiesResponse = await supabase.from(PROPERTIES_SALE_RENT_TABLE).select("*").limit(1);

    // Check for errors
    if (propertiesResponse.error) throw propertiesResponse.error;

    const propertiesData = propertiesResponse.data;

    // Process dictionaries into a record by ID
    const properties: Record<string, Property> = {};
    propertiesData?.forEach((property) => {
      properties[property.id] = {
        ...property,
        is_new: false,
      };
    });

    console.log("Properties loaded from Supabase:", {
      propertiesCount: Object.keys(properties).length,
    });

    return {
      properties,
      error: null,
    };
  } catch (error) {
    console.error("Failed to load dictionaries:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      properties: {},
      error: errorMessage,
    };
  }
}
