import { produce } from "immer";
import { StateCreator } from "zustand";
import { DBCode, DBSerialID, DBTemporarySerialID } from "@/entities/common";
import {
  createEntryEditSlice,
  DBDictionary,
  DBDictionaryEntry,
  EntryStoreSliceActions,
  EntryStoreSliceState,
  MutableDictionary,
} from "@/entities/dictionaries/";
import { LocalizedText } from "@/entities/localized-text";

export interface DictionaryOnlyStoreSliceState extends EntryStoreSliceState {
  dictionaries: Record<DBSerialID, MutableDictionary>;
  dictionariesByCode: Record<DBCode, DBSerialID>;
  deletedDictionaryIds: DBSerialID[];
  temporaryDictionaryId: DBTemporarySerialID;
}

export interface DictionaryOnlyStoreSliceActions extends EntryStoreSliceActions {
  addDictionary: (name: LocalizedText) => void;
  updateDictionary: (id: DBSerialID, updater: (draft: MutableDictionary) => void) => void;
  deleteDictionary: (id: DBSerialID) => void;
}

export type DictionaryOnlyStoreSlice = DictionaryOnlyStoreSliceState & DictionaryOnlyStoreSliceActions;

export const createDictionaryOnlyStoreSlice = (
  initialDictionaries: DBDictionary[],
  initialEntries: DBDictionaryEntry[],
): StateCreator<DictionaryOnlyStoreSlice, [], [], DictionaryOnlyStoreSlice> => {
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

  return (set, get, api) => ({
    dictionaries: convertedDictionaries,
    dictionariesByCode: convertedDictionariesByCode,
    deletedDictionaryIds: [],
    temporaryDictionaryId: -1,

    ...createEntryEditSlice(initialEntries)(set, get, api),
    addDictionary: (name: LocalizedText) =>
      set(
        produce((draft: DictionaryOnlyStoreSlice) => {
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
        produce((draft: DictionaryOnlyStoreSlice) => {
          if (draft.dictionaries[id]) {
            updater(draft.dictionaries[id]);
          }
        }),
      );
    },

    deleteDictionary: (id: DBSerialID) =>
      set(
        produce((draft: DictionaryOnlyStoreSlice) => {
          const dictionary = draft.dictionaries[id];
          if (!dictionary) return;

          if (!dictionary.is_new) {
            draft.deletedDictionaryIds.push(id);
          }
          delete draft.dictionaries[id];
        }),
      ),
  });
};
