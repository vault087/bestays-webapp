import { useStore } from "zustand";
import {
  DictionaryStore,
  DictionaryStoreActions,
  DictionaryStoreApi,
  useDictionaryStoreContext,
} from "@/entities/dictionaries/";
import { MutableEntry } from "@/entities/dictionaries/types/dictionary.types";

// const EMPTY_ENTRIES = {};

export function useDictionaryStore<T>(selector: (state: DictionaryStore) => T): T {
  const store = useDictionaryStoreContext() as DictionaryStoreApi;
  return useStore(store, selector);
}

// Access dictionary actions
export function useDictionaryActions(): DictionaryStoreActions {
  const store = useDictionaryStoreContext();
  return store.getState();
}

// export function useDictionaryByCode(code: string): MutableDictionary | undefined {
//   return useDictionaryStore((state) =>
//     Object.values(state.dictionaries).find((dictionary) => dictionary.code === code),
//   );
// }

// Access a specific entry by dictionary ID and entry ID
export function useDictionaryEntry(dictionaryId: number, entryId: number): MutableEntry | undefined {
  return useDictionaryStore((state) => state.entries[dictionaryId]?.[entryId]);
}

// const EMPTY_ENTRIES_ARRAY: MutableEntry[] = [];
// export function useDictionaryEntriesByCode(code: DBCode): MutableEntry[] {
//   const dictionaries = useDictionaryStore((state) => state.dictionaries);
//   const entries = useDictionaryStore((state) => state.entries);

//   return useMemo(() => {
//     const matchingDictionaries = Object.values(dictionaries).filter((dictionary) => dictionary.code === code);
//     if (matchingDictionaries.length === 0) {
//       return EMPTY_ENTRIES_ARRAY;
//     }
//     const dictionaryId = matchingDictionaries[0].id;
//     return Object.values(entries[dictionaryId] || EMPTY_ENTRIES);
//   }, [dictionaries, entries, code]);
// }

// export function useDictionaryEntries(dictionaryId: number | undefined): Record<number, MutableEntry> {
//   return useDictionaryStore((state) => (dictionaryId ? state.entries[dictionaryId] || EMPTY_ENTRIES : EMPTY_ENTRIES));
// }
