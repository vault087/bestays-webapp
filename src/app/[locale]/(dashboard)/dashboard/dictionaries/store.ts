import { createStore, StoreApi } from "zustand";
import {
  createDictionaryOnlyStoreSlice,
  DictionaryOnlyStoreSlice,
} from "@/entities/dictionaries/store/slices/dictionary.slice";
import { EntryStoreSlice } from "@/entities/dictionaries/store/slices/entry.slice";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";

export type DictionaryPageStore = DictionaryOnlyStoreSlice & EntryStoreSlice;

// // Store creator function
export function createDictionaryPageStore(
  dictionaries: DBDictionary[],
  entries: DBDictionaryEntry[],
): StoreApi<DictionaryPageStore> {
  const dictionaryOnlySliceCreator = createDictionaryOnlyStoreSlice(dictionaries, entries);

  return createStore<DictionaryPageStore>()((set, get, api) => {
    return {
      ...dictionaryOnlySliceCreator(set, get, api),
    };
  });
}
