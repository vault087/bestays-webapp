import {
  Dictionary,
  DictionaryEntry,
  DICTIONARIES_TABLE,
  DICTIONARY_ENTRIES_TABLE,
} from "@/entities/dictionaries/types/dictionary.types";
import { supabase } from "@/modules/supabase/clients/client";

export type DictionariesResponse = Promise<{
  dictionaries: Record<number, Dictionary>;
  entries: Record<number, Record<number, DictionaryEntry>>;
  error: string | null;
}>;

/**
 * Loads all dictionaries and their entries from Supabase
 */
export async function loadAllDictionaries(): DictionariesResponse {
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

    // Process dictionaries into a record by ID
    const dictionaries: Record<number, Dictionary> = {};
    dictionariesData?.forEach((dict) => {
      dictionaries[dict.id] = {
        ...dict,
        is_new: false,
      };
    });

    // Process entries into a nested record by dictionary_id and entry id
    const entries: Record<number, Record<number, DictionaryEntry>> = {};
    entriesData?.forEach((entry) => {
      if (!entries[entry.dictionary_id]) {
        entries[entry.dictionary_id] = {};
      }

      entries[entry.dictionary_id][entry.id] = {
        ...entry,
        is_new: false,
      };
    });

    console.log("Data loaded from Supabase:", {
      dictCount: Object.keys(dictionaries).length,
      entriesCount: Object.keys(entries).length,
    });

    return {
      dictionaries,
      entries,
      error: null,
    };
  } catch (error) {
    console.error("Failed to load dictionaries:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      dictionaries: {},
      entries: {},
      error: errorMessage,
    };
  }
}
