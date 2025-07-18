import { produce, enablePatches } from "immer";
import { StateCreator } from "zustand";
import { DBDictionaryEntry, MutableEntry } from "@/entities/dictionaries/types/dictionary.types";
import { DBSerialID, DBTemporarySerialID } from "@/entities/dictionaries/types/shared-db.types";
import { LocalizedText } from "@/entities/localized-text";

enablePatches();

export interface EntryStoreSliceState {
  entries: Record<DBSerialID, Record<DBSerialID, MutableEntry>>;
  deletedEntryIds: DBSerialID[];
  temporaryEntryId: DBTemporarySerialID;
}

// Entry Store Actions
export interface EntryStoreSliceActions {
  addEntry: (dictionaryId: DBSerialID, name: LocalizedText) => void;
  updateEntry: (dictionaryId: DBSerialID, entryId: DBSerialID, updater: (draft: MutableEntry) => void) => void;
  deleteEntry: (dictionaryId: DBSerialID, entryId: DBSerialID) => void;
}

export interface EntryStoreSlice extends EntryStoreSliceState, EntryStoreSliceActions {}

export const createEntryEditSlice = (
  initialEntries: DBDictionaryEntry[],
): StateCreator<EntryStoreSlice, [], [], EntryStoreSlice> => {
  const convertedEntries: Record<DBSerialID, Record<DBSerialID, MutableEntry>> = {};
  initialEntries.forEach((entry) => {
    if (!convertedEntries[entry.dictionary_id]) {
      convertedEntries[entry.dictionary_id] = {};
    }
    convertedEntries[entry.dictionary_id][entry.id] = { ...entry, is_new: false };
  });

  return (set) => ({
    entries: convertedEntries,
    deletedEntryIds: [],
    temporaryEntryId: -1,

    addEntry: (dictionaryId: DBSerialID, name: LocalizedText) =>
      set(
        produce((draft: EntryStoreSlice) => {
          const newEntry = {
            id: draft.temporaryEntryId,
            is_active: true,
            dictionary_id: dictionaryId,
            name,
            is_new: true,
          };

          if (!draft.entries[dictionaryId]) {
            draft.entries[dictionaryId] = {};
          }
          draft.entries[dictionaryId][newEntry.id] = newEntry;
          draft.temporaryEntryId--;
        }),
      ),

    updateEntry: (dictionaryId: DBSerialID, entryId: DBSerialID, updater: (draft: MutableEntry) => void) => {
      set(
        produce((draft: EntryStoreSlice) => {
          if (dictionaryId && draft.entries[dictionaryId]) {
            updater(draft.entries[dictionaryId][entryId]);
          }
        }),
      );
    },

    deleteEntry: (dictionaryId: DBSerialID, entryId: DBSerialID) => {
      set(
        produce((draft: EntryStoreSlice) => {
          if (!dictionaryId || !draft.entries[dictionaryId]) {
            return;
          }

          const entry = draft.entries[dictionaryId][entryId];
          if (entry && !entry.is_new) {
            draft.deletedEntryIds.push(entryId);
          }

          delete draft.entries[dictionaryId][entryId];
        }),
      );
    },
  });
};
