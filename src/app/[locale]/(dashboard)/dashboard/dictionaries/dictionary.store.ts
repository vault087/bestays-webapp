import { createStore, StoreApi } from "zustand";
import {
  createDictionaryOnlyStoreSlice,
  DictionaryOnlyStoreSlice,
} from "@/entities/dictionaries/store/slices/dictionary.slice";
import { EntryStoreSlice } from "@/entities/dictionaries/store/slices/entry.slice";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";

// // Combined Dictionary Store State
// export interface DictionaryStoreState extends DictionaryOnlyStoreSliceState, EntryStoreSliceState {
//   hasHydrated: boolean;
// }
// export interface DictionaryStoreActions extends DictionaryOnlyStoreSliceActions, EntryStoreSliceActions {}
// export type DictionaryStoreApi = StoreApi<DictionaryStore>;

export type DictionaryStore = DictionaryOnlyStoreSlice & EntryStoreSlice;

// // Store creator function
export function createMemoryDictionaryStore(
  dictionaries: DBDictionary[],
  entries: DBDictionaryEntry[],
): StoreApi<DictionaryStore> {
  const dictionaryOnlySliceCreator = createDictionaryOnlyStoreSlice(dictionaries, entries);

  return createStore<DictionaryStore>()((set, get, api) => {
    return {
      ...dictionaryOnlySliceCreator(set, get, api),
    };
  });
}
