import { createStore, StoreApi } from "zustand";
import { Dictionary, DictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";
import {
  DictionaryEditStoreActions,
  DictionaryEditStoreState,
  DictionaryEditStoreStateInternal,
  createDictionaryEditSlice,
} from "./store-slices/dictionary.store-slice";
import {
  EntryEditStoreActions,
  EntryEditStoreState,
  EntryEditStoreStateInternal,
  createEntryEditSlice,
} from "./store-slices/entry.store-slice";

export const EMPTY_ENTRIES: Record<number, DictionaryEntry> = {};

// Dictionary Store State
export interface DictionaryStoreState
  extends DictionaryEditStoreState,
    EntryEditStoreState,
    DictionaryEditStoreStateInternal,
    EntryEditStoreStateInternal {
  hasHydrated: boolean;
}

// Dictionary Store Actions
export interface DictionaryStoreActions extends DictionaryEditStoreActions, EntryEditStoreActions {}

// Combined store type
export type DictionaryStore = DictionaryStoreState & DictionaryStoreActions;
export type DictionaryStoreApi = StoreApi<DictionaryStore>;

// Store creator function
export function createDictionaryStore(dictionaries: Dictionary[], entries: DictionaryEntry[]): DictionaryStoreApi {
  const initialState = {
    dictionaries,
    entries,
    hasHydrated: false,
    deletedDictionaryIds: [],
    deletedEntryIds: [],
    temporaryDictionaryId: -1,
    temporaryEntryId: -1,
  };

  return createStore<DictionaryStore>()((set, get, store) => ({
    ...createDictionaryEditSlice(dictionaries)(set, get, store),
    ...createEntryEditSlice(entries)(set, get, store),
    ...initialState,
  }));
}
