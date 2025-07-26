"use server";
import { z } from "zod";
import { DBDictionaryEntry, DBDictionaryEntrySchema, DICTIONARY_ENTRIES_TABLE } from "@/entities/dictionaries";
import { supabase } from "@/modules/supabase/clients/client";

export type DBEntryResponse = Promise<{
  data: DBDictionaryEntry | null;
  error: string | null;
}>;

export const DBDictionaryInsertEntrySchema = DBDictionaryEntrySchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export type DBDictionaryInsertEntry = z.infer<typeof DBDictionaryInsertEntrySchema>;
export async function insertNewEntry(entry: DBDictionaryInsertEntry): DBEntryResponse {
  try {
    const checkedValue = DBDictionaryInsertEntrySchema.parse(entry);

    const { data, error } = await supabase.from(DICTIONARY_ENTRIES_TABLE).insert(checkedValue);
    return {
      data: data,
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
