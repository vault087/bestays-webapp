import { z } from "zod";
import { LocalizedTextSchema } from "@/entities/localized-text/types/localized-text.type";

// Table constants
export const DICTIONARIES_TABLE = "dictionaries";
export const DICTIONARY_ENTRIES_TABLE = "dictionary_entries";

// Database Schemas
export const DBDictionarySchema = z.object({
  id: z.number().int().positive(),
  type: z.string().min(1).max(50),
  name: LocalizedTextSchema,
});

export const DBDictionaryEntrySchema = z.object({
  id: z.number().int().positive(),
  dictionary_id: z.number().int().positive(),
  code: z.string().min(1).max(50),
  name: LocalizedTextSchema,
});

// Form Schemas (extend DB schemas)
export const DictionarySchema = DBDictionarySchema.extend({
  is_new: z.boolean().default(false),
});

export const DictionaryEntrySchema = DBDictionaryEntrySchema.extend({
  is_new: z.boolean().default(false),
});

// Types
export type DBDictionary = z.infer<typeof DBDictionarySchema>;
export type DBDictionaryEntry = z.infer<typeof DBDictionaryEntrySchema>;
export type Dictionary = z.infer<typeof DictionarySchema>;
export type DictionaryEntry = z.infer<typeof DictionaryEntrySchema>;
