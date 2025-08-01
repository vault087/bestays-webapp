"use client";

import { createStore, StoreApi } from "zustand";
import { persist } from "zustand/middleware";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";
import {
  createDictionariesStoreSlice,
  DictionariesStoreSlice,
  DictionariesStoreSliceActions,
} from "./slices/dictionaries.slice";

export type DictionaryFormStoreState = DictionariesStoreSlice;
export type DictionaryFormStoreActions = DictionariesStoreSliceActions;

export type DictionaryFormStore = DictionaryFormStoreState &
  DictionaryFormStoreActions & {
    hydrated: boolean;
  };

// // Store creator function
export function createDictionaryFormStore(
  dictionaries: DBDictionary[],
  entries: DBDictionaryEntry[],
): StoreApi<DictionaryFormStore> {
  const dictionarySliceCreator = createDictionariesStoreSlice(dictionaries, entries);

  return createStore<DictionaryFormStore>()(
    persist(
      (set, get, api) => {
        return {
          hydrated: false,
          ...dictionarySliceCreator(set, get, api), // This already includes EntriesStoreSlice
        };
      },
      {
        name: "dictionary-form-store",

        partialize: (state) => ({
          dbDictionaries: state.dbDictionaries,
          dbEntries: state.dbEntries,
          dictionaries: state.dictionaries,
          dictionaryIds: state.dictionaryIds,
          entriesIds: state.entriesIds,
          entries: state.entries,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.hydrated = true;
          }
        },
      },
    ),
  );
}
