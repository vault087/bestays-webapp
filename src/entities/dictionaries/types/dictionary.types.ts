import { z } from "zod";
import { DBCodeSchema, DBSerialIDSchema } from "@/entities/common";
import { LocalizedTextSchema } from "@/entities/localized-text";

// Table constants
export const DICTIONARIES_TABLE = "dictionaries";
export const DICTIONARY_ENTRIES_TABLE = "dictionary_entries";

export const DBMetadataSchema = z.object({
  info: z.string().nullish(),
});

// Database Schemas
export const DBDictionarySchema = z.object({
  id: DBSerialIDSchema,
  code: DBCodeSchema,
  name: LocalizedTextSchema,
  description: LocalizedTextSchema.nullish(),
  metadata: DBMetadataSchema.nullish(),
  created_by: z.string().nullish(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export const DBDictionaryEntrySchema = z.object({
  id: DBSerialIDSchema,
  is_active: z.boolean().default(true),
  dictionary_id: DBSerialIDSchema,
  name: LocalizedTextSchema,
  created_by: z.string().nullish(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

// Types
export type DBDictionary = z.infer<typeof DBDictionarySchema>;
export type DBDictionaryEntry = z.infer<typeof DBDictionaryEntrySchema>;
