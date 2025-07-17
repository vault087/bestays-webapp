import { produce, applyPatches, enablePatches, produceWithPatches } from "immer";
import { StateCreator } from "zustand";
import { Dictionary } from "@/entities/dictionaries/types/dictionary.types";
import { DBSerialID, DBTemporarySerialID } from "@/entities/dictionaries/types/shared-db.types";
import { LocalizedText } from "@/entities/localized-text";

enablePatches();

export interface DictionaryEditStoreState {
  dictionaries: Record<DBSerialID, Dictionary>;
  dictionaryChanges: Record<DBSerialID, Partial<Dictionary>>; // For API optimization, we track changes to dictionaries
  deletedDictionaryIds: DBSerialID[];
}

export interface DictionaryEditStoreStateInternal {
  temporaryDictionaryId: DBTemporarySerialID;
}

// Dictionary Store Actions
export interface DictionaryEditStoreActions {
  addDictionary: (name: LocalizedText) => void;
  updateDictionary: (id: DBSerialID, updater: (draft: Dictionary) => void) => void;
  deleteDictionary: (id: DBSerialID) => void;
}

export interface DictionaryEditStore
  extends DictionaryEditStoreState,
    DictionaryEditStoreActions,
    DictionaryEditStoreStateInternal {}

export const createDictionaryEditSlice: StateCreator<DictionaryEditStore> = (set, get) => ({
  dictionaries: {},
  dictionaryChanges: {},
  deletedDictionaryIds: [],
  temporaryDictionaryId: -1,

  addDictionary: (name: LocalizedText) =>
    set((state) => {
      const newDictionary = {
        id: state.temporaryDictionaryId,
        code: "",
        name,
        is_new: true,
      };

      state.dictionaries[newDictionary.id] = newDictionary;
      state.dictionaryChanges[newDictionary.id] = newDictionary;
      state.temporaryDictionaryId--;

      return state;
    }),

  updateDictionary: (id: DBSerialID, updater: (draft: Dictionary) => void) => {
    const [nextState, patches] = produceWithPatches(get(), (draft: DictionaryEditStore) => {
      if (!id || !draft.dictionaries[id]) {
        return;
      }
      updater(draft.dictionaries[id]);
    });

    set(nextState);

    if (patches.length > 0) {
      set((state) => {
        if (!state.dictionaryChanges[id]) {
          state.dictionaryChanges[id] = {};
        }
        state.dictionaryChanges[id] = applyPatches(state.dictionaryChanges[id], patches);
        return state;
      });
    }
  },

  deleteDictionary: (id: DBSerialID) => {
    if (!id || !get().dictionaries[id]) {
      return;
    }

    set(
      produce((state: DictionaryEditStore) => {
        // Track for deletion if it's from DB
        const dictionary = state.dictionaries[id];
        if (dictionary && !dictionary.is_new) {
          state.deletedDictionaryIds.push(id);
        }

        // Clean up references
        delete state.dictionaries[id];
        delete state.dictionaryChanges[id];

        return state;
      }),
    );
  },
});
