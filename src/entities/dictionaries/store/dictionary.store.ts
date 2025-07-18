import { createStore, StoreApi } from "zustand";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";
import {
  DictionaryOnlyStoreSliceState,
  DictionaryOnlyStoreSliceActions,
  createDictionaryOnlyStoreSlice,
} from "./slices/dictionary-only.slice";
import { EntryStoreSliceState, EntryStoreSliceActions, createEntryEditSlice } from "./slices/entry.slice";

// Combined Dictionary Store State
export interface DictionaryStoreState extends DictionaryOnlyStoreSliceState, EntryStoreSliceState {
  hasHydrated: boolean;
}
export interface DictionaryStoreActions extends DictionaryOnlyStoreSliceActions, EntryStoreSliceActions {}
export type DictionaryStore = DictionaryStoreState & DictionaryStoreActions;
export type DictionaryStoreApi = StoreApi<DictionaryStore>;

// Store creator function
export function createDefaultDictionaryStore(
  dictionaries: DBDictionary[],
  entries: DBDictionaryEntry[],
): DictionaryStoreApi {
  const dictionaryOnlySliceCreator = createDictionaryOnlyStoreSlice(dictionaries);
  const entrySliceCreator = createEntryEditSlice(entries);

  return createStore<DictionaryStore>()((set, get, api) => {
    return {
      hasHydrated: false,
      ...dictionaryOnlySliceCreator(set, get, api),
      ...entrySliceCreator(set, get, api),
    };
  });
}
