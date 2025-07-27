"use server";
import { z } from "zod";
import { DBDictionaryEntry, DBDictionaryEntrySchema, DICTIONARY_ENTRIES_TABLE } from "@/entities/dictionaries";
import { getSupabase } from "@/modules/supabase/clients/server";

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
    const supabase = await getSupabase();
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

export type DBBatchEntryResponse = Promise<{
  data: DBDictionaryEntry[] | null;
  error: string | null;
}>;

export async function updateEntries(entries: DBDictionaryInsertEntry[]): DBBatchEntryResponse {
  try {
    // Validate all entries
    const checkedEntries = entries.map((entry) => DBDictionaryInsertEntrySchema.parse(entry));

    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from(DICTIONARY_ENTRIES_TABLE)
      .upsert(checkedEntries, { onConflict: "id" })
      .select();

    return {
      data: data,
      error: error?.message ?? null,
    };
  } catch (error) {
    console.error("Failed to update entries batch:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      data: null,
      error: errorMessage,
    };
  }
}
