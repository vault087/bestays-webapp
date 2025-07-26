import { z } from "zod";
import { DBCodeSchema, DBSerialIDSchema } from "@/entities/common";
import { LocalizedTextSchema } from "@/entities/localized-text";

// Table constants
export const DICTIONARIES_TABLE = "bestays_dictionaries";
export const DICTIONARY_ENTRIES_TABLE = "bestays_dictionary_entries";

export const DICTIONARY_NAME_MAX = 255;
export const DICTIONARY_DESCRIPTION_MAX = 2000;
export const DICTIONARY_META_INFO_MAX = 2000;

export const DICTIONARY_ENTRY_NAME_MAX = 255;

export const DBDictionaryMetadataSchema = z.object({
  info: z.string().max(DICTIONARY_META_INFO_MAX).nullish(),
});

// Database Schemas
export const DBDictionarySchema = z.object({
  id: DBSerialIDSchema,
  code: DBCodeSchema,
  name: LocalizedTextSchema(DICTIONARY_NAME_MAX),
  description: LocalizedTextSchema(DICTIONARY_DESCRIPTION_MAX).nullish(),
  metadata: DBDictionaryMetadataSchema.nullish(),
  created_by: z.string().uuid().nullish(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export const DBDictionaryEntrySchema = z.object({
  id: DBSerialIDSchema,
  is_active: z.boolean().default(true),
  dictionary_id: DBSerialIDSchema,
  name: LocalizedTextSchema(DICTIONARY_ENTRY_NAME_MAX),
  created_by: z.string().uuid().nullish(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

// Types
export type DBDictionary = z.infer<typeof DBDictionarySchema>;
export type DBDictionaryEntry = z.infer<typeof DBDictionaryEntrySchema>;
