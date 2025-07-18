import { Dictionary, DictionaryEntry } from "@/entities/dictionaries";
import { loadAndConvertAllDictionaries, loadEntries, loadDictionaries } from "@/entities/dictionaries/libs";

export type GetDictionariesActionResponse = Promise<{
  dictionaries: Dictionary[];
  entries: DictionaryEntry[];
  error: string | null;
}>;

/**
 * React Server Component compatible function to load dictionaries
 * This is designed to be called during server rendering and passed as a promise
 */
export async function getDictionariesAction(): GetDictionariesActionResponse {
  try {
    const [dictionariesResponse, entriesResponse] = await Promise.all([loadDictionaries(), loadEntries()]);

    return {
      dictionaries: dictionariesResponse.dictionaries || [],
      entries: entriesResponse.entries || [],
      error: null,
    };
  } catch (error) {
    console.error("Failed to load dictionaries:", error);

    return {
      dictionaries: [],
      entries: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
