import { createStore, StoreApi } from "zustand";
import {
  DictionaryStoreSliceState,
  DictionaryStoreSliceActions,
  createDictionaryEditSlice,
} from "@/entities/dictionaries/store-slices/dictionary.store-slice";
import {
  EntryStoreSliceState,
  EntryStoreSliceActions,
  createEntryEditSlice,
} from "@/entities/dictionaries/store-slices/entry.store-slice";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";

// Combined Dictionary Store State
export interface DictionaryStoreState extends DictionaryStoreSliceState, EntryStoreSliceState {
  hasHydrated: boolean;
}
export interface DictionaryStoreActions extends DictionaryStoreSliceActions, EntryStoreSliceActions {}
export type DictionaryStore = DictionaryStoreState & DictionaryStoreActions;
export type DictionaryStoreApi = StoreApi<DictionaryStore>;

// Store creator function
export function createDictionaryStore(dictionaries: DBDictionary[], entries: DBDictionaryEntry[]): DictionaryStoreApi {
  const dictionarySliceCreator = createDictionaryEditSlice(dictionaries);
  const entrySliceCreator = createEntryEditSlice(entries);

  return createStore<DictionaryStore>()((set, get, api) => {
    return {
      hasHydrated: false,
      ...dictionarySliceCreator(set, get, api),
      ...entrySliceCreator(set, get, api),
    };
  });
}
