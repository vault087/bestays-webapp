import { DBDictionary, DICTIONARIES_TABLE } from "@/entities/dictionaries/types/dictionary.types";
import { supabase } from "@/modules/supabase/clients/client";

export type DBDictionariesResponse = Promise<{
  data: DBDictionary[];
  error: string | null;
}>;

/**
 * Loads all dictionaries and their entries from Supabase
 */
export async function loadDictionaries(): DBDictionariesResponse {
  try {
    // Fetch dictionaries and entries in parallel
    const dictionariesResponse = await supabase.from(DICTIONARIES_TABLE).select("*");

    // Check for errors
    if (dictionariesResponse.error) throw dictionariesResponse.error;

    const dictionariesData = dictionariesResponse.data;

    return {
      data: dictionariesData,
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
