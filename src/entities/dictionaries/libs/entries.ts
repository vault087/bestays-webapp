"use server";

import { DBDictionaryEntry, DICTIONARY_ENTRIES_TABLE } from "@/entities/dictionaries/types/dictionary.types";
import { supabase } from "@/modules/supabase/clients/client";

export type DBEntriesResponse = Promise<{
  data: DBDictionaryEntry[];
  error: string | null;
}>;

export async function loadEntries(): DBEntriesResponse {
  try {
    // Fetch dictionaries and entries in parallel
    const entriesResponse = await supabase.from(DICTIONARY_ENTRIES_TABLE).select("*");

    // Check for errors
    if (entriesResponse.error) throw entriesResponse.error;

    const entriesData = entriesResponse.data;

    return {
      data: entriesData,
      error: null,
    };
  } catch (error) {
    console.error("Failed to load dictionaries:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      data: [],
      error: errorMessage,
    };
  }
}

export type DBEntryResponse = Promise<{
  data: DBDictionaryEntry | null;
  error: string | null;
}>;

export type DBDictionaryInsertEntry = Omit<DBDictionaryEntry, "id" | "created_at" | "updated_at">;
export async function addEntry(entry: DBDictionaryInsertEntry): DBEntryResponse {
  try {
    const { data, error } = await supabase.from(DICTIONARY_ENTRIES_TABLE).insert(entry);
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
