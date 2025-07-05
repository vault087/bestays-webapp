import { Dictionary, DictionaryEntry, loadAllDictionaries } from "@/entities/dictionaries";

export type GetDictionariesActionResponse = Promise<{
  dictionaries: Record<number, Dictionary>;
  entries: Record<number, Record<number, DictionaryEntry>>;
  error: string | null;
}>;

/**
 * React Server Component compatible function to load dictionaries
 * This is designed to be called during server rendering and passed as a promise
 */
export async function getDictionariesAction(): GetDictionariesActionResponse {
  try {
    return await loadAllDictionaries();
  } catch (error) {
    console.error("Failed to load dictionaries:", error);

    return {
      dictionaries: {},
      entries: {},
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
