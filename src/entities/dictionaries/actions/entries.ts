"use server";
import { DBDictionaryEntry, DICTIONARY_ENTRIES_TABLE } from "@/entities/dictionaries";
import {
  DBDictionaryInsertEntry,
  DBDictionaryInsertEntrySchema,
  DBEntryResponse,
} from "@/entities/dictionaries/libs/actions/entries-action.types";
import { getSupabase } from "@/modules/supabase/clients/server";

export type DBBatchEntryResponse = Promise<{
  data: DBDictionaryEntry[] | null;
  error: string | null;
}>;

export async function insertNewEntry(entry: DBDictionaryInsertEntry): DBEntryResponse {
  try {
    const checkedValue = DBDictionaryInsertEntrySchema.parse(entry);
    const supabase = await getSupabase();
    const { data, error } = await supabase.from(DICTIONARY_ENTRIES_TABLE).insert(checkedValue).select().limit(1);
    return {
      data: data?.[0] || null,
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
