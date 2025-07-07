import { z } from "zod";
import { LocalizedTextSchema } from "@/entities/localized-text";

// Table constants
export const DICTIONARIES_TABLE = "dictionaries";
export const DICTIONARY_ENTRIES_TABLE = "dictionary_entries";

export const DBCodeSchema = z.string().min(1).max(50);

// Database Schemas
export const DBDictionarySchema = z.object({
  id: z.number().int().positive(),
  code: DBCodeSchema,
  name: LocalizedTextSchema,
  description: z.string().nullish(),
});

export const DBDictionaryEntrySchema = z.object({
  id: z.number().int().positive(),
  is_active: z.boolean().default(true),
  dictionary_id: z.number().int().positive(),
  code: DBCodeSchema.nullish(),
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
export type DBCode = z.infer<typeof DBCodeSchema>;

export type Dictionary = z.infer<typeof DictionarySchema>;
export type DictionaryEntry = z.infer<typeof DictionaryEntrySchema>;
export type Code = DBCode;
