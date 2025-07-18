import { createStore, StoreApi } from "zustand";
import { createDictionaryStoreSlice, DictionaryStoreSlice } from "@/entities/dictionaries/stores/dictionary.slice";
import { EntryStoreSlice } from "@/entities/dictionaries/stores/entry.slice";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";

export type DictionaryPageStore = DictionaryStoreSlice & EntryStoreSlice;

// // Store creator function
export function createDictionaryPageStore(
  dictionaries: DBDictionary[],
  entries: DBDictionaryEntry[],
): StoreApi<DictionaryPageStore> {
  const dictionaryOnlySliceCreator = createDictionaryStoreSlice(dictionaries, entries);

  return createStore<DictionaryPageStore>()((set, get, api) => {
    return {
      ...dictionaryOnlySliceCreator(set, get, api),
    };
  });
}
