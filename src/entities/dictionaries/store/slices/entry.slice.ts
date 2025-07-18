import { produce } from "immer";
import { StateCreator } from "zustand";
import { DBSerialID, DBTemporarySerialID } from "@/entities/common/";
import { DBDictionaryEntry, MutableEntry } from "@/entities/dictionaries/";
import { LocalizedText } from "@/entities/localized-text";

export interface EntryStoreSliceState {
  entries: Record<DBSerialID, Record<DBSerialID, MutableEntry>>;
  deletedEntryIds: DBSerialID[];
  temporaryEntryId: DBTemporarySerialID;
}

// Entry Store Actions
export interface EntryStoreSliceActions {
  addEntry: (dictionaryId: DBSerialID, name: LocalizedText) => MutableEntry;
  updateEntry: (dictionaryId: DBSerialID, entryId: DBSerialID, updater: (draft: MutableEntry) => void) => void;
  deleteEntry: (dictionaryId: DBSerialID, entryId: DBSerialID) => void;
}

export interface EntryStoreSlice extends EntryStoreSliceState, EntryStoreSliceActions {}

export const createEntryEditSlice = (
  initialEntries: DBDictionaryEntry[],
): StateCreator<EntryStoreSlice, [], [], EntryStoreSlice> => {
  const convertedEntries: Record<DBSerialID, Record<DBSerialID, MutableEntry>> = {};

  initialEntries.forEach((entry) => {
    const dictionaryId = entry.dictionary_id;
    if (!convertedEntries[dictionaryId]) {
      convertedEntries[dictionaryId] = {};
    }
    convertedEntries[dictionaryId][entry.id] = { ...entry, is_new: false };
  });

  const entriesSorting: Record<number, DBSerialID> = {};
  initialEntries.forEach((entry, index) => {
    entriesSorting[index] = entry.id;
  });

  return (set) => ({
    entries: convertedEntries,
    deletedEntryIds: [],
    temporaryEntryId: -1,

    addEntry: (dictionaryId: DBSerialID, name: LocalizedText) => {
      const newEntry = {
        id: -1, // Will be updated in set
        is_active: true,
        dictionary_id: dictionaryId,
        name,
        is_new: true,
      };

      set(
        produce((draft: EntryStoreSlice) => {
          newEntry.id = draft.temporaryEntryId;

          if (!draft.entries[dictionaryId]) {
            draft.entries[dictionaryId] = {};
          }
          draft.entries[dictionaryId][newEntry.id] = newEntry;
          draft.temporaryEntryId--;
        }),
      );

      return newEntry;
    },

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
          if (!dictionaryId) return;
          if (!draft.entries[dictionaryId]) return;

          const entry = draft.entries[dictionaryId][entryId];
          if (!entry) return;

          if (!entry.is_new) {
            draft.deletedEntryIds.push(entryId);
          }

          delete draft.entries[dictionaryId][entryId];
        }),
      );
    },
  });
};
