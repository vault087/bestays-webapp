import {
  DBDictionary,
  DBDictionaryEntry,
  DICTIONARIES_TABLE,
  DICTIONARY_ENTRIES_TABLE,
} from "@/entities/dictionaries/types/dictionary.types";
import { supabase } from "@/modules/supabase/clients/client";

export type DictionariesResponse = Promise<{
  dictionaries: DBDictionary[];
  entries: DBDictionaryEntry[];
  error: string | null;
}>;

/**
 * Loads all dictionaries and their entries from Supabase
 */
export async function loadDictionaries(): DictionariesResponse {
  try {
    // Fetch dictionaries and entries in parallel
    const [dictionariesResponse, entriesResponse] = await Promise.all([
      supabase.from(DICTIONARIES_TABLE).select("*"),
      supabase.from(DICTIONARY_ENTRIES_TABLE).select("*"),
    ]);

    // Check for errors
    if (dictionariesResponse.error) throw dictionariesResponse.error;
    if (entriesResponse.error) throw entriesResponse.error;

    const dictionariesData = dictionariesResponse.data;
    const entriesData = entriesResponse.data;

    return {
      dictionaries: dictionariesData,
      entries: entriesData,
      error: null,
    };
  } catch (error) {
    console.error("Failed to load dictionaries:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      dictionaries: [],
      entries: [],
      error: errorMessage,
    };
  }
}
