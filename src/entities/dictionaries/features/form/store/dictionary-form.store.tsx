"use client";

import { createStore, StoreApi } from "zustand";
import { persist } from "zustand/middleware";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";
import {
  createDictionaryStoreSlice,
  DictionaryStoreSlice,
  DictionaryStoreSliceActions,
} from "./slices/dictionaries.slice";

export type DictionaryFormStoreState = DictionaryStoreSlice;
export type DictionaryFormStoreActions = DictionaryStoreSliceActions;

export type DictionaryFormStore = DictionaryFormStoreState &
  DictionaryFormStoreActions & {
    hydrated: boolean;
  };

// // Store creator function
export function createDictionaryFormStore(
  dictionaries: DBDictionary[],
  entries: DBDictionaryEntry[],
): StoreApi<DictionaryFormStore> {
  const dictionarySliceCreator = createDictionaryStoreSlice(dictionaries, entries);

  return createStore<DictionaryFormStore>()(
    persist(
      (set, get, api) => {
        return {
          hydrated: false,
          ...dictionarySliceCreator(set, get, api), // This already includes EntryStoreSlice
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
