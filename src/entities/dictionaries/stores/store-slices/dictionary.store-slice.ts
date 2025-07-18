import { produce, enablePatches } from "immer";
import { StateCreator } from "zustand";
import { Dictionary } from "@/entities/dictionaries/types/dictionary.types";
import { DBSerialID, DBTemporarySerialID } from "@/entities/dictionaries/types/shared-db.types";
import { LocalizedText } from "@/entities/localized-text";

enablePatches();

export interface DictionaryEditStoreState {
  dictionaries: Record<DBSerialID, Dictionary>;
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

export const createDictionaryEditSlice = (
  initialDictionaries: Dictionary[],
): StateCreator<DictionaryEditStore, [], [], DictionaryEditStore> => {
  const convertedDictionaries: Record<number, Dictionary> = {};
  initialDictionaries.forEach((dict) => {
    convertedDictionaries[dict.id] = { ...dict, is_new: false };
  });

  // Return the StateCreator function
  return (set) => ({
    // Initial state
    dictionaries: convertedDictionaries,
    deletedDictionaryIds: [],
    temporaryDictionaryId: -1,

    // Actions
    addDictionary: (name: LocalizedText) =>
      set(
        produce((draft: DictionaryEditStore) => {
          const newDictionary = {
            id: draft.temporaryDictionaryId,
            code: "",
            name,
            is_new: true,
          };
          draft.dictionaries[newDictionary.id] = newDictionary;
          draft.temporaryDictionaryId--;
        }),
      ),

    updateDictionary: (id: DBSerialID, updater: (draft: Dictionary) => void) => {
      set(
        produce((draft: DictionaryEditStore) => {
          if (draft.dictionaries[id]) {
            updater(draft.dictionaries[id]);
          }
        }),
      );
    },

    deleteDictionary: (id: DBSerialID) =>
      set(
        produce((draft: DictionaryEditStore) => {
          const dictionary = draft.dictionaries[id];
          if (dictionary && !dictionary.is_new) {
            draft.deletedDictionaryIds.push(id);
          }
          delete draft.dictionaries[id];
        }),
      ),
  });
};
