import { z } from "zod";
import { DBDictionarySchema, DBDictionaryEntrySchema } from "@/entities/dictionaries/types/dictionary.types";

// Form Schemas (extend DB schemas)
export const MutableDictionarySchema = DBDictionarySchema.omit({
  created_by: true,
  created_at: true,
  updated_at: true,
}).extend({
  is_new: z.boolean().default(false),
});

export const MutableEntrySchema = DBDictionaryEntrySchema.omit({
  created_by: true,
  created_at: true,
  updated_at: true,
});

export type MutableDictionary = z.infer<typeof MutableDictionarySchema>;
export type MutableEntry = z.infer<typeof MutableEntrySchema>;
