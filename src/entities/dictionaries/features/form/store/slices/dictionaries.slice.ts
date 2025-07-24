import { produce } from "immer";
import { StateCreator } from "zustand";
import { DBCode, DBSerialID, DBTemporarySerialID, generateTemporarySerialId } from "@/entities/common";
import { DBDictionary, DBDictionaryEntry, MutableDictionary } from "@/entities/dictionaries/";
import { LocalizedText } from "@/entities/localized-text";
import { EntriesStoreSliceActions, EntriesStoreSliceState, createEntriesStoreSlice } from "./entries.slice";

export interface DictionariesStoreSliceState extends EntriesStoreSliceState {
  dbDictionaries: DBDictionary[];
  dictionaries: Record<DBSerialID, MutableDictionary>;
  dictionaryIds: DBSerialID[]; // dictionaryIds
  dictionaryByCode: Record<DBCode, DBSerialID>;
  deletedDictionaryIds: DBSerialID[];
  temporaryDictionaryId: DBTemporarySerialID;
}

export interface DictionariesStoreSliceActions extends EntriesStoreSliceActions {
  addDictionary: (name: LocalizedText) => void;
  updateDictionary: (id: DBSerialID, updater: (draft: MutableDictionary) => void) => void;
  deleteDictionary: (id: DBSerialID) => void;
}

export type DictionariesStoreSlice = DictionariesStoreSliceState & DictionariesStoreSliceActions;

export const createDictionariesStoreSlice = (
  initialDictionaries: DBDictionary[],
  initialEntries: DBDictionaryEntry[],
): StateCreator<DictionariesStoreSlice, [], [], DictionariesStoreSlice> => {
  const convertedDictionaries: Record<DBSerialID, MutableDictionary> = {};
  const dictionaryIds: DBSerialID[] = [];

  const convertedDictionariesByCode: Record<DBCode, DBSerialID> = {};
  initialDictionaries.forEach((dict) => {
    convertedDictionaries[dict.id] = { ...dict, is_new: false };
    convertedDictionariesByCode[dict.code] = dict.id;
    dictionaryIds.push(dict.id);
  });

  return (set, get, api) => ({
    dbDictionaries: initialDictionaries,
    dictionaries: convertedDictionaries,
    dictionaryIds: dictionaryIds,
    dictionaryByCode: convertedDictionariesByCode,
    deletedDictionaryIds: [],
    temporaryDictionaryId: generateTemporarySerialId(),

    ...createEntriesStoreSlice(initialEntries)(set, get, api),
    addDictionary: (name: LocalizedText) =>
      set(
        produce((draft: DictionariesStoreSlice) => {
          const newDictionary = {
            id: draft.temporaryDictionaryId,
            code: "",
            name,
            is_new: true,
          };
          draft.dictionaries[newDictionary.id] = newDictionary;
          draft.dictionaryIds.push(newDictionary.id);
          draft.temporaryDictionaryId--;
        }),
      ),

    updateDictionary: (id: DBSerialID, updater: (draft: MutableDictionary) => void) => {
      set(
        produce((draft: DictionariesStoreSlice) => {
          if (draft.dictionaries[id]) {
            updater(draft.dictionaries[id]);
          }
        }),
      );
    },

    deleteDictionary: (id: DBSerialID) =>
      set(
        produce((draft: DictionariesStoreSlice) => {
          const dictionary = draft.dictionaries[id];
          if (!dictionary) return;

          if (!dictionary.is_new) {
            draft.deletedDictionaryIds.push(id);
          }
          delete draft.dictionaries[id];
          draft.deleteEntries(id);
          draft.dictionaryIds = draft.dictionaryIds.filter((id) => id !== id);
        }),
      ),
  });
};
