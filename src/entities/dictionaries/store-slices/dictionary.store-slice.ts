import { produce, enablePatches } from "immer";
import { StateCreator } from "zustand";
import { DBCode, DBSerialID, DBTemporarySerialID } from "@/entities/common";
import { DBDictionary, MutableDictionary } from "@/entities/dictionaries/";
import { LocalizedText } from "@/entities/localized-text";

enablePatches();

export interface DictionaryStoreSliceState {
  dictionaries: Record<DBSerialID, MutableDictionary>;
  dictionariesByCode: Record<DBCode, DBSerialID>;
  dictionariesSorting: Record<number, DBSerialID>;
  deletedDictionaryIds: DBSerialID[];
  temporaryDictionaryId: DBTemporarySerialID;
}

export interface DictionaryStoreSliceActions {
  addDictionary: (name: LocalizedText) => void;
  updateDictionary: (id: DBSerialID, updater: (draft: MutableDictionary) => void) => void;
  deleteDictionary: (id: DBSerialID) => void;
}

export interface DictionaryStoreSlice extends DictionaryStoreSliceState, DictionaryStoreSliceActions {}

export const createDictionaryEditSlice = (
  initialDictionaries: DBDictionary[],
): StateCreator<DictionaryStoreSlice, [], [], DictionaryStoreSlice> => {
  const convertedDictionaries: Record<DBSerialID, MutableDictionary> = {};
  const convertedDictionariesByCode: Record<DBCode, DBSerialID> = {};
  initialDictionaries.forEach((dict) => {
    convertedDictionaries[dict.id] = { ...dict, is_new: false };
    convertedDictionariesByCode[dict.code] = dict.id;
  });

  const dictionariesSorting: Record<number, DBSerialID> = {};
  initialDictionaries.forEach((dict, index) => {
    dictionariesSorting[index] = dict.id;
  });

  return (set) => ({
    dictionaries: convertedDictionaries,
    dictionariesByCode: convertedDictionariesByCode,
    dictionariesSorting,
    deletedDictionaryIds: [],
    temporaryDictionaryId: -1,

    addDictionary: (name: LocalizedText) =>
      set(
        produce((draft: DictionaryStoreSlice) => {
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

    updateDictionary: (id: DBSerialID, updater: (draft: MutableDictionary) => void) => {
      set(
        produce((draft: DictionaryStoreSlice) => {
          if (draft.dictionaries[id]) {
            updater(draft.dictionaries[id]);
          }
        }),
      );
    },

    deleteDictionary: (id: DBSerialID) =>
      set(
        produce((draft: DictionaryStoreSlice) => {
          const dictionary = draft.dictionaries[id];
          if (dictionary && !dictionary.is_new) {
            draft.deletedDictionaryIds.push(id);
          }
          delete draft.dictionaries[id];
        }),
      ),
  });
};
