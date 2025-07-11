import { produce } from "immer";
import { createStore, StoreApi } from "zustand";
import { Dictionary, DictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";

export const EMPTY_ENTRIES: Record<number, DictionaryEntry> = {};

// Dictionary Store State
export interface DictionaryStoreState {
  hasHydrated: boolean;
  dictionaries: Record<number, Dictionary>;
  entries: Record<number, Record<number, DictionaryEntry>>;
  hasChanged: boolean;
  deletedDictionaryIds: number[];
  deletedEntryIds: number[];
}

// Dictionary Store Actions
export interface DictionaryStoreActions {
  addDictionary: (dictionary: Dictionary) => void;
  updateDictionary: (id: number, updater: (draft: Dictionary) => void) => void;
  deleteDictionary: (id: number) => void;
  addEntry: (dictionaryId: number, entry: DictionaryEntry) => void;
  updateEntry: (dictionaryId: number, entryId: number, updater: (draft: DictionaryEntry) => void) => void;
  deleteEntry: (dictionaryId: number, entryId: number) => void;
  // Validation methods (computed, no state changes)
  validateEntryCode: (dictionaryId: number, entryId: number, code: string) => string | undefined;
  isEntryCodeDuplicate: (dictionaryId: number, entryId: number, code: string) => boolean;
}

// Combined store type
export type DictionaryStore = DictionaryStoreState & DictionaryStoreActions;
export type DictionaryStoreApi = StoreApi<DictionaryStore>;

// Store creator function
export function createDictionaryStore(
  dictionaries: Record<number, Dictionary>,
  entries: Record<number, Record<number, DictionaryEntry>>,
): DictionaryStoreApi {
  const initialState = {
    dictionaries,
    entries,
    hasHydrated: false,
    hasChanged: false,
    deletedDictionaryIds: [],
    deletedEntryIds: [],
  };

  return createStore<DictionaryStore>()((set, get) => ({
    ...initialState,

    // Dictionary actions
    addDictionary: (dictionary: Dictionary) =>
      set(
        produce((state: DictionaryStore) => {
          state.dictionaries[dictionary.id] = dictionary;
          if (!state.entries[dictionary.id]) {
            state.entries[dictionary.id] = {};
          }
          state.hasChanged = true;
        }),
      ),

    updateDictionary: (id: number, updater: (draft: Dictionary) => void) =>
      set(
        produce((state: DictionaryStore) => {
          if (state.dictionaries[id]) {
            updater(state.dictionaries[id]);
            state.hasChanged = true;
          }
        }),
      ),

    deleteDictionary: (id: number) =>
      set(
        produce((state: DictionaryStore) => {
          // Track for deletion if it's from DB
          const dictionary = state.dictionaries[id];
          if (dictionary && !dictionary.is_new) {
            state.deletedDictionaryIds.push(id);
          }

          // Track entry IDs for deletion
          if (state.entries[id]) {
            Object.values(state.entries[id]).forEach((entry) => {
              if (!entry.is_new) {
                state.deletedEntryIds.push(entry.id);
              }
            });
          }

          // Clean up references
          delete state.dictionaries[id];
          delete state.entries[id];
          state.hasChanged = true;
        }),
      ),

    // Entry actions
    addEntry: (dictionaryId: number, entry: DictionaryEntry) =>
      set(
        produce((state: DictionaryStore) => {
          if (!state.entries[dictionaryId]) {
            state.entries[dictionaryId] = {};
          }
          state.entries[dictionaryId][entry.id] = entry;
          state.hasChanged = true;
        }),
      ),

    updateEntry: (dictionaryId: number, entryId: number, updater: (draft: DictionaryEntry) => void) =>
      set(
        produce((state: DictionaryStore) => {
          if (state.entries[dictionaryId]?.[entryId]) {
            updater(state.entries[dictionaryId][entryId]);
            state.hasChanged = true;
          }
        }),
      ),

    deleteEntry: (dictionaryId: number, entryId: number) =>
      set(
        produce((state: DictionaryStore) => {
          // Track for deletion if it's from DB
          const entry = state.entries[dictionaryId]?.[entryId];
          if (entry && !entry.is_new) {
            state.deletedEntryIds.push(entryId);
          }

          // Clean up reference
          if (state.entries[dictionaryId]) {
            delete state.entries[dictionaryId][entryId];
            state.hasChanged = true;
          }
        }),
      ),

    // Validation methods
    isEntryCodeDuplicate: (dictionaryId: number, entryId: number, code: string) => {
      const state = get();
      const entries = state.entries[dictionaryId] || {};
      return Object.values(entries).some((otherEntry) => otherEntry.id !== entryId && otherEntry.code === code);
    },

    validateEntryCode: (dictionaryId: number, entryId: number, code: string) => {
      const state = get();
      if (!code) {
        return "Code cannot be empty";
      }
      if (state.isEntryCodeDuplicate(dictionaryId, entryId, code)) {
        return "Code must be unique within this dictionary";
      }
      return undefined;
    },
  }));
}
