"use server";
import { revalidatePath } from "next/cache";
import { DBProperty, DBPropertySchema, PROPERTIES_SALE_RENT_TABLE } from "@/entities/properties-sale-rent";
import { supabase } from "@/modules/supabase/clients/client";

export async function createNewProperty(): Promise<{
  data: DBProperty | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase.from(PROPERTIES_SALE_RENT_TABLE).insert({}).select("*");

    if (data && !error) {
      // Revalidate the properties page
      revalidatePath("/dashboard/properties");
      // If you have a properties list on other pages, revalidate those too
      // revalidatePath("/properties");

      // Alternative: Use tags if you've tagged your data fetching
      // revalidateTag("properties");
    }

    return {
      data: data?.[0] ?? null,
      error: error?.message ?? null,
    };
  } catch (error) {
    console.error("Failed to add entry:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      data: null,
      error: errorMessage,
    };
  }
}

export async function updateProperty(
  id: string,
  updates: Partial<DBProperty>,
): Promise<{
  data: DBProperty | null;
  error: string | null;
}> {
  try {
    const property = DBPropertySchema.parse(updates);

    const { data, error } = await supabase
      .from(PROPERTIES_SALE_RENT_TABLE)
      .update(property)
      .eq("id", id)
      .select("*")
      .single();

    if (data && !error) {
      // Revalidate the properties page
      revalidatePath("/dashboard/properties");
      // Revalidate specific property page if it exists
      revalidatePath(`/dashboard/properties/${id}`);

      // Alternative: Use tags
      // revalidateTag("properties");
      // revalidateTag(`property-${id}`);
    }

    return {
      data: data ?? null,
      error: error?.message ?? null,
    };
  } catch (error) {
    console.error("Failed to update property:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      data: null,
      error: errorMessage,
    };
  }
}
