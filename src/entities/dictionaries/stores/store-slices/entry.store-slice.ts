import { produce, enablePatches } from "immer";
import { StateCreator } from "zustand";
import { DictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";
import { DBSerialID, DBTemporarySerialID } from "@/entities/dictionaries/types/shared-db.types";
import { LocalizedText } from "@/entities/localized-text";

enablePatches();

export interface EntryEditStoreState {
  entries: Record<DBSerialID, Record<DBSerialID, DictionaryEntry>>;
  deletedEntryIds: DBSerialID[];
}

export interface EntryEditStoreStateInternal {
  temporaryEntryId: DBTemporarySerialID;
}

// Entry Store Actions
export interface EntryEditStoreActions {
  addEntry: (dictionaryId: DBSerialID, name: LocalizedText) => void;
  updateEntry: (dictionaryId: DBSerialID, entryId: DBSerialID, updater: (draft: DictionaryEntry) => void) => void;
  deleteEntry: (dictionaryId: DBSerialID, entryId: DBSerialID) => void;
}

export interface EntryEditStore extends EntryEditStoreState, EntryEditStoreActions, EntryEditStoreStateInternal {}

export const createEntryEditSlice = (
  initialEntries: DictionaryEntry[],
): StateCreator<EntryEditStore, [], [], EntryEditStore> => {
  const convertedEntries: Record<DBSerialID, Record<DBSerialID, DictionaryEntry>> = {};
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
        produce((draft: EntryEditStore) => {
          const newEntry = {
            id: draft.temporaryEntryId,
            is_active: true,
            dictionary_id: dictionaryId,
            name,
            is_new: true,
          };

          draft.entries[newEntry.id] = newEntry;
          draft.temporaryEntryId--;

          return draft;
        }),
      ),

    updateEntry: (dictionaryId: DBSerialID, entryId: DBSerialID, updater: (draft: DictionaryEntry) => void) => {
      set(
        produce((draft: EntryEditStore) => {
          if (dictionaryId && draft.entries[dictionaryId]) {
            updater(draft.entries[dictionaryId][entryId]);
          }
        }),
      );
    },

    deleteEntry: (dictionaryId: DBSerialID, entryId: DBSerialID) => {
      set(
        produce((draft: EntryEditStore) => {
          if (!dictionaryId || !draft.entries[dictionaryId]) {
            return;
          }

          const entry = draft.entries[dictionaryId][entryId];
          if (entry && !entry.is_new) {
            draft.deletedEntryIds.push(entryId);
          }

          delete draft.entries[dictionaryId][entryId];
          return draft;
        }),
      );
    },
  });
};
