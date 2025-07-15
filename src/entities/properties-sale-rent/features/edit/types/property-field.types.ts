import { z } from "zod";
import { DBPropertySchema } from "@/entities/properties-sale-rent/core/types";

// Form Schemas (extend DB schemas)
export const PropertySchema = DBPropertySchema.omit({
  created_by: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
}).extend({
  is_new: z.boolean().default(false),
});

export type Property = z.infer<typeof PropertySchema>;
