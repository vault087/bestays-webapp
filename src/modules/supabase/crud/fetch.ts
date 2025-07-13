import { z } from "zod";
import { supabase } from "@/modules/supabase/clients/client";

// Utility types for cleaner type definitions
type SubSchema<S extends z.ZodRawShape, K extends keyof S> = z.ZodObject<Pick<S, K>>;
type InferFromSubset<S extends z.ZodRawShape, K extends keyof S> = z.infer<SubSchema<S, K>>;

// Response type for the fetch function
export type FetchResponse<T> = {
  data: T[];
  error: string | null;
};

// Supabase response type for better contract clarity
type SupabaseResponse<T> = {
  data: T[] | null;
  error: { message: string } | null;
};

export async function fetch<S extends z.ZodRawShape, K extends keyof S & string>(
  table: string,
  baseSchema: z.ZodObject<S>,
  fields: K[],
): Promise<FetchResponse<InferFromSubset<S, K>>> {
  try {
    // Runtime validation: ensure all fields exist in schema
    for (const field of fields) {
      if (!(field in baseSchema.shape)) {
        throw new Error(
          `Field "${field}" not found in schema. Available fields: ${Object.keys(baseSchema.shape).join(", ")}`,
        );
      }
    }

    // Convert field names to string for Supabase select
    const selectFields = fields.join(", ");

    // Fetch only the required fields from Supabase with better typing
    const response = (await supabase.from(table).select(selectFields)) as unknown as SupabaseResponse<
      Pick<z.infer<z.ZodObject<S>>, K>
    >;

    // Check for errors
    if (response.error) throw new Error(response.error.message);

    const data = response.data || [];

    // Create a runtime schema that only includes the selected fields
    const fieldSchema = z.object(
      fields.reduce(
        (acc, field) => {
          acc[field] = baseSchema.shape[field];
          return acc;
        },
        {} as Record<K, z.ZodTypeAny>,
      ),
    );

    // Validate and filter each entity against the field schema
    const validEntities: InferFromSubset<S, K>[] = [];

    data.forEach((entity) => {
      try {
        // Parse the entity against the field schema
        const validatedEntity = fieldSchema.safeParse(entity);

        // Only push successful validations and unwrap the data
        if (validatedEntity.success) {
          validEntities.push(validatedEntity.data);
        }
      } catch (validationError) {
        console.log("validationError", validationError);
        // console.error(`Failed to validate entity:`, {
        // entity,
        // error: validationError instanceof Error ? validationError.message : validationError,
        // });
      }
    });

    // console.log("Entities loaded from Supabase:", {
    //   table,
    //   totalFetched: data.length,
    //   validEntities: validEntities.length,
    //   invalidEntities: data.length - validEntities.length,
    //   fields,
    // });

    return {
      data: validEntities,
      error: null,
    };
  } catch (error) {
    console.error("Failed to load entities:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      data: [],
      error: errorMessage,
    };
  }
}
