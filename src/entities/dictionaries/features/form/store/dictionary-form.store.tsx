"use client";

import { createStore, StoreApi } from "zustand";
import { persist } from "zustand/middleware";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";
import { createDictionaryStoreSlice, DictionaryStoreSlice } from "./slices/dictionary.slice";
import { EntryStoreSlice } from "./slices/entry.slice";

export type DictionaryPageStore = DictionaryStoreSlice &
  EntryStoreSlice & {
    hydrated: boolean;
  };

// // Store creator function
export function createDictionaryFormStore(
  dictionaries: DBDictionary[],
  entries: DBDictionaryEntry[],
): StoreApi<DictionaryPageStore> {
  const dictionarySliceCreator = createDictionaryStoreSlice(dictionaries, entries);

  return createStore<DictionaryPageStore>()(
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
          hydrated: state.hydrated,
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
