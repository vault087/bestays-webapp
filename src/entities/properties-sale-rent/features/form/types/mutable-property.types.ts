import { z } from "zod";
import { DBProperty, DBPropertySchema } from "@/entities/properties-sale-rent";
import { generateUUID } from "@/utils/generate-uuid";

// Form Schemas (extend DB schemas)
export const MutablePropertySchema = DBPropertySchema.omit({
  created_by: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
}).extend({
  is_new: z.boolean().default(false),
});

export type MutableProperty = z.infer<typeof MutablePropertySchema>;

export function convertToMutableProperty(property?: DBProperty): MutableProperty {
  if (!property) {
    return {
      id: generateUUID(),
      is_new: true,
    };
  }

  return {
    ...property,
    is_new: false,
  };
}
