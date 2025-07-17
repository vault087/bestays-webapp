import { useMemo } from "react";
import { useStore } from "zustand";
import { DictionaryStore, DictionaryStoreActions, useDictionaryStoreContext } from "@/entities/dictionaries";
import { DBCode, Dictionary, DictionaryEntry } from "@/entities/dictionaries/types/";

const EMPTY_ENTRIES = {};

export function useDictionaryStore<T>(selector: (state: DictionaryStore) => T): T {
  const store = useDictionaryStoreContext();
  return useStore(store, selector);
}

// Access dictionary actions
export function useDictionaryActions(): DictionaryStoreActions {
  const store = useDictionaryStoreContext();
  return store.getState();
}

export function useDictionaryByCode(code: string): Dictionary | undefined {
  return useDictionaryStore((state) =>
    Object.values(state.dictionaries).find((dictionary) => dictionary.code === code),
  );
}

// Access a specific entry by dictionary ID and entry ID
export function useDictionaryEntry(dictionaryId: number, entryId: number): DictionaryEntry | undefined {
  return useDictionaryStore((state) => state.entries[dictionaryId]?.[entryId]);
}

const EMPTY_ENTRIES_ARRAY: DictionaryEntry[] = [];
export function useDictionaryEntriesByCode(code: DBCode): DictionaryEntry[] {
  const dictionaries = useDictionaryStore((state) => state.dictionaries);
  const entries = useDictionaryStore((state) => state.entries);

  return useMemo(() => {
    const matchingDictionaries = Object.values(dictionaries).filter((dictionary) => dictionary.code === code);
    if (matchingDictionaries.length === 0) {
      return EMPTY_ENTRIES_ARRAY;
    }
    const dictionaryId = matchingDictionaries[0].id;
    return Object.values(entries[dictionaryId] || EMPTY_ENTRIES);
  }, [dictionaries, entries, code]);
}

export function useDictionaryEntries(dictionaryId: number | undefined): Record<number, DictionaryEntry> {
  return useDictionaryStore((state) => (dictionaryId ? state.entries[dictionaryId] || EMPTY_ENTRIES : EMPTY_ENTRIES));
}
