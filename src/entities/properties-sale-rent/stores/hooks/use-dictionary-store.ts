import { useMemo } from "react";
import { useStore } from "zustand";
import { useDictionaryStoreContext } from "@/entities/dictionaries/stores/contexts/dictionary-store.context";
import { DictionaryStore } from "@/entities/dictionaries/stores/dictionary.store";
import { Dictionary, DictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";

export function useDictionaryStore<T>(selector: (state: DictionaryStore) => T): T {
  const store = useDictionaryStoreContext();
  return useStore(store, selector);
}

// Access dictionary actions
export function useDictionaryActions(): {
  addDictionary: (dictionary: Dictionary) => void;
  updateDictionary: (id: number, updater: (draft: Dictionary) => void) => void;
  deleteDictionary: (id: number) => void;
  addEntry: (dictionaryId: number, entry: DictionaryEntry) => void;
  updateEntry: (dictionaryId: number, entryId: number, updater: (draft: DictionaryEntry) => void) => void;
  deleteEntry: (dictionaryId: number, entryId: number) => void;
  validateEntryCode: (dictionaryId: number, entryId: number, code: string) => string | undefined;
} {
  const store = useDictionaryStoreContext();
  return useMemo(
    () => ({
      addDictionary: (dictionary) => store.getState().addDictionary(dictionary),
      updateDictionary: (id, updater) => store.getState().updateDictionary(id, updater),
      deleteDictionary: (id) => store.getState().deleteDictionary(id),
      addEntry: (dictionaryId, entry) => store.getState().addEntry(dictionaryId, entry),
      updateEntry: (dictionaryId, entryId, updater) => store.getState().updateEntry(dictionaryId, entryId, updater),
      deleteEntry: (dictionaryId, entryId) => store.getState().deleteEntry(dictionaryId, entryId),
      validateEntryCode: (dictionaryId, entryId, code) =>
        store.getState().validateEntryCode(dictionaryId, entryId, code),
    }),
    [store],
  );
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
