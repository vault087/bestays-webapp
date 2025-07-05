import { useMemo } from "react";
import { useStore } from "zustand";
import { usePropertyStoreContext } from "@/entities/properties-sale-rent/stores/contexts/property-store.context";
import { PropertyStore } from "@/entities/properties-sale-rent/stores/property.store";
import { Property } from "@/entities/properties-sale-rent/types/property.types";

export function usePropertyStore<T>(selector: (state: PropertyStore) => T): T {
  const store = usePropertyStoreContext();
  return useStore(store, selector);
}

// Access dictionary actions
export function usePropertyActions(): {
  addProperty: (property: Property) => void;
  updateProperty: (id: string, updater: (draft: Property) => void) => void;
  deleteProperty: (id: string) => void;
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
