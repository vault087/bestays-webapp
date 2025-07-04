import { useCallback, useMemo } from "react";
import { useStore } from "zustand";
import { useDictionaryStoreContext } from "@/entities/dictionaries/stores/contexts/dictionary-store.context";
import { DictionaryStore } from "@/entities/dictionaries/stores/dictionary.store";
import { Dictionary, DictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";

// Access the dictionary store
export function useDictionaryStore<T>(selector: (state: DictionaryStore) => T): T {
  const store = useDictionaryStoreContext();
  // Memoize the selector to prevent infinite loop from getServerSnapshot
  const memoizedSelector = useCallback(selector, [selector]);
  return useStore(store, memoizedSelector);
}

// Access dictionary actions
export function useDictionaryActions(): {
  addDictionary: (dictionary: Dictionary) => void;
  updateDictionary: (id: number, updater: (draft: Dictionary) => void) => void;
  deleteDictionary: (id: number) => void;
  addEntry: (dictionaryId: number, entry: DictionaryEntry) => void;
  updateEntry: (dictionaryId: number, entryId: number, updater: (draft: DictionaryEntry) => void) => void;
  deleteEntry: (dictionaryId: number, entryId: number) => void;
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
    }),
    [store],
  );
}

// Access a specific dictionary by ID
export function useDictionary(id: number): Dictionary | undefined {
  return useDictionaryStore(useCallback((state) => state.dictionaries[id], [id]));
}

// Access a specific entry by dictionary ID and entry ID
export function useDictionaryEntry(dictionaryId: number, entryId: number): DictionaryEntry | undefined {
  return useDictionaryStore(useCallback((state) => state.entries[dictionaryId]?.[entryId], [dictionaryId, entryId]));
}

// Get sorted entry IDs (alphabetically by code)
export function useDictionaryEntriesSorted(dictionaryId: number): number[] {
  return useDictionaryStore(
    useCallback(
      (state) => {
        const entries = state.entries[dictionaryId] || {};

        return Object.values(entries)
          .sort((a, b) => a.code.localeCompare(b.code))
          .map((entry) => entry.id);
      },
      [dictionaryId],
    ),
  );
}
