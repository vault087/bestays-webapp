import { createClient } from "@supabase/supabase-js";
import {
  Dictionary,
  DictionaryEntry,
  DICTIONARIES_TABLE,
  DICTIONARY_ENTRIES_TABLE,
} from "@/entities/dictionaries/types/dictionary.types";

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Loads all dictionaries and their entries from Supabase
 */
export async function loadAllDictionaries(): Promise<{
  dictionaries: Record<number, Dictionary>;
  entries: Record<number, Record<number, DictionaryEntry>>;
  error: string | null;
}> {
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
        id: dict.id,
        code: dict.code,
        name: dict.name || {},
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
        id: entry.id,
        dictionary_id: entry.dictionary_id,
        code: entry.code,
        name: entry.name || {},
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

/**
 * React Server Component compatible function to load dictionaries
 * This is designed to be called during server rendering and passed as a promise
 */
export function getDictionaries(): Promise<{
  dictionaries: Record<number, Dictionary>;
  entries: Record<number, Record<number, DictionaryEntry>>;
  error: string | null;
}> {
  return loadAllDictionaries();
}
