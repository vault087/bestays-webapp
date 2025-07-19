import { produce } from "immer";
import { StateCreator } from "zustand";
import { DBCode, DBSerialID, DBTemporarySerialID } from "@/entities/common";
import { DBDictionary, DBDictionaryEntry, MutableDictionary } from "@/entities/dictionaries/";
import { LocalizedText } from "@/entities/localized-text";
import { EntryStoreSliceActions, EntryStoreSliceState, createEntryStoreSlice } from "./entry.slice";

export interface DictionaryStoreSliceState extends EntryStoreSliceState {
  dbDictionaries: DBDictionary[];
  dictionaries: Record<DBSerialID, MutableDictionary>;
  dictionaryIds: DBSerialID[]; // dictionaryIds
  dictionaryByCode: Record<DBCode, DBSerialID>;
  deletedDictionaryIds: DBSerialID[];
  temporaryDictionaryId: DBTemporarySerialID;
}

export interface DictionaryStoreSliceActions extends EntryStoreSliceActions {
  addDictionary: (name: LocalizedText) => void;
  updateDictionary: (id: DBSerialID, updater: (draft: MutableDictionary) => void) => void;
  deleteDictionary: (id: DBSerialID) => void;
}

export type DictionaryStoreSlice = DictionaryStoreSliceState & DictionaryStoreSliceActions;

export const createDictionaryStoreSlice = (
  initialDictionaries: DBDictionary[],
  initialEntries: DBDictionaryEntry[],
): StateCreator<DictionaryStoreSlice, [], [], DictionaryStoreSlice> => {
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
    temporaryDictionaryId: -1,

    ...createEntryStoreSlice(initialEntries)(set, get, api),
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
          draft.dictionaryIds.push(newDictionary.id);
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
          if (!dictionary) return;

          if (!dictionary.is_new) {
            draft.deletedDictionaryIds.push(id);
          }
          delete draft.dictionaries[id];
          draft.dictionaryIds = draft.dictionaryIds.filter((id) => id !== id);
        }),
      ),
  });
};
