"use server";
import { revalidatePath } from "next/cache";
import { DBProperty, DBPropertySchema, PROPERTIES_SALE_RENT_TABLE } from "@/entities/properties-sale-rent";
import { getSupabase } from "@/modules/supabase/clients/server";

export async function createNewProperty(): Promise<{
  data: DBProperty | null;
  error: string | null;
}> {
  try {
    const supabase = await getSupabase();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        data: null,
        error: authError?.message || "",
      };
    }
    const { data, error } = await supabase
      .from(PROPERTIES_SALE_RENT_TABLE)
      .insert({ created_by: user.id }) // Explicitly set created_by
      .select("*");

    if (data && !error) {
      revalidatePath("/dashboard/properties");
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

// Usage in your component:
// const { data: { user } } = await supabase.auth.getUser();
// await createNewProperty(user.id);

export async function updateProperty(
  id: string,
  updates: Partial<DBProperty>,
): Promise<{
  data: DBProperty | null;
  error: string | null;
}> {
  try {
    const supabase = await getSupabase();
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
