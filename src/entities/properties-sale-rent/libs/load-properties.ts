import { DBProperty, PROPERTIES_SALE_RENT_TABLE } from "@/entities/properties-sale-rent";
import { supabase } from "@/modules/supabase/clients/client";
// import { fetch } from "@/modules/supabase/crud/fetch";

export const DASHBOARD_LISTING_FIELDS: (keyof DBProperty)[] = [
  "id",
  "personal_title",
  "property_type",
  "area",
  "rent_price",
  "sale_price",
  "rent_enabled",
  "sale_enabled",
  "cover_image",
  "is_published",
  "updated_at",
  "deleted_at",
];

export type DashboardProperty = Pick<DBProperty, (typeof DASHBOARD_LISTING_FIELDS)[number]>;

export async function loadDashboardPropertyListings(): Promise<DashboardProperty[]> {
  const response = await supabase
    .from("bestays_properties")
    .select("*")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });
  return response.data || [];

  // return fetch(PROPERTIES_SALE_RENT_TABLE, DBPropertySchema, DASHBOARD_LISTING_FIELDS);
}

// export async function loadDashboardPropertyDetails(id: number): Promise<ReturnType<typeof fetch>> {
//   const response = (await supabase
//     .from(PROPERTIES_SALE_RENT_TABLE)
//     .select("*")
//     .eq("id", id)) as unknown as SupabaseResponse<DBProperty>;

//   return response;
// }

export type DashboardPropertyFetchResponse = {
  data?: DBProperty;
  error: string | null;
};

export async function loadDashboardPropertyDetails(propertyId: string): Promise<DashboardPropertyFetchResponse> {
  try {
    // Fetch dictionaries and entries in parallel
    const response = await supabase.from(PROPERTIES_SALE_RENT_TABLE).select("*").eq("id", propertyId);

    // Check for errors
    if (response.error) throw response.error;

    if (!response.data || response.data.length === 0) {
      return {
        data: undefined,
        error: "Property not found",
      };
    }

    return {
      data: response.data[0],
      error: null,
    };
  } catch (error) {
    console.error("Failed to load dictionaries:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      data: undefined,
      error: errorMessage,
    };
  }
}
