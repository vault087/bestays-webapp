import { DBPropertySchema, PROPERTIES_SALE_RENT_TABLE } from "@/entities/properties-sale-rent";
import { fetch } from "@/modules/supabase/crud/fetch";

// Helper function for listing properties with specific fields
export function listing(): ReturnType<typeof fetch> {
  return fetch(PROPERTIES_SALE_RENT_TABLE, DBPropertySchema, ["area"]);
}

// Additional helper functions for common field combinations
export function loadPropertySummaries(): ReturnType<typeof fetch> {
  return fetch(PROPERTIES_SALE_RENT_TABLE, DBPropertySchema, ["id", "title", "property_type", "area", "is_published"]);
}

export function loadPropertyDetails(): ReturnType<typeof fetch> {
  return fetch(PROPERTIES_SALE_RENT_TABLE, DBPropertySchema, ["id", "description"]);
}
