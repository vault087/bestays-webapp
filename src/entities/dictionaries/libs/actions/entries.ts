"use server";
import { DICTIONARY_ENTRIES_TABLE } from "@/entities/dictionaries/types/dictionary.types";
import { supabase } from "@/modules/supabase/clients/client";
import { DBDictionaryInsertEntry, DBEntryResponse, DBDictionaryInsertEntrySchema } from "./entries-action.types";

export async function insertNewEntry(entry: DBDictionaryInsertEntry): DBEntryResponse {
  try {
    const checkedValue = DBDictionaryInsertEntrySchema.parse(entry);

    const { data, error } = await supabase.from(DICTIONARY_ENTRIES_TABLE).insert(checkedValue).select("*");
    return {
      data: data?.[0] ?? null,
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
