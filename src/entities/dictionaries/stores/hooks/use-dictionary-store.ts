import { useStore } from "zustand";
import { DictionaryStore, DictionaryStoreActions, useDictionaryStoreContext } from "@/entities/dictionaries";
import { Dictionary, DictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";

export function useDictionaryStore<T>(selector: (state: DictionaryStore) => T): T {
  const store = useDictionaryStoreContext();
  return useStore(store, selector);
}

// Access dictionary actions
export function useDictionaryActions(): DictionaryStoreActions {
  const store = useDictionaryStoreContext();
  return store.getState();
}

// Access a specific dictionary by ID
export function useDictionary(id: number): Dictionary | undefined {
  return useDictionaryStore((state) => state.dictionaries[id]);
}

// Access a specific entry by dictionary ID and entry ID
export function useDictionaryEntry(dictionaryId: number, entryId: number): DictionaryEntry | undefined {
  return useDictionaryStore((state) => state.entries[dictionaryId]?.[entryId]);
}

export function useDictionaryEntries(dictionaryId: number): DictionaryEntry[] {
  return useDictionaryStore((state) => Object.values(state.entries[dictionaryId] || EMPTY_ENTRIES));
}

const EMPTY_ENTRIES = {};
// Get sorted entry IDs (alphabetically by code)
export function useDictionaryEntriesSortedIds(dictionaryId: number): number[] {
  return useDictionaryStore((state) => {
    const entries = state.entries[dictionaryId] || EMPTY_ENTRIES;
    return Object.values(entries)
      .sort((a, b) => a.code.localeCompare(b.code))
      .map((entry) => entry.id);
  });
}
