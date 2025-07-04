import { useMemo } from "react";
import { useStore } from "zustand";
import { useDictionaryStoreContext } from "@/entities/dictionaries/stores/contexts/dictionary-store.context";
import { DictionaryStore } from "@/entities/dictionaries/stores/dictionary.store";
import { Dictionary, DictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";

// Access the dictionary store
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
} {
  const store = useDictionaryStoreContext();
  return useMemo(
    () => ({
      addDictionary: store.getState().addDictionary,
      updateDictionary: store.getState().updateDictionary,
      deleteDictionary: store.getState().deleteDictionary,
      addEntry: store.getState().addEntry,
      updateEntry: store.getState().updateEntry,
      deleteEntry: store.getState().deleteEntry,
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

// Get sorted entry IDs (alphabetically by code)
export function useDictionaryEntriesSorted(dictionaryId: number): number[] {
  return useDictionaryStore((state) => {
    const entries = state.entries[dictionaryId] || {};

    return Object.values(entries)
      .sort((a, b) => a.code.localeCompare(b.code))
      .map((entry) => entry.id);
  });
}
