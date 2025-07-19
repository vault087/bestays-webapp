import { produce } from "immer";
import { StateCreator } from "zustand";
import { DBSerialID, DBTemporarySerialID } from "@/entities/common/";
import { DBDictionaryEntry, MutableEntry } from "@/entities/dictionaries/";
import { LocalizedText } from "@/entities/localized-text";

export interface EntryStoreSliceState {
  dbEntries: DBDictionaryEntry[];
  entries: Record<DBSerialID, Record<DBSerialID, MutableEntry>>; // dictionaryId -> entryId -> entry
  entriesIds: Record<DBSerialID, DBSerialID[]>; // dictionaryId -> entryIds
  deletedEntryIds: DBSerialID[];
  temporaryEntryId: DBTemporarySerialID;
}

// Entry Store Actions
export interface EntryStoreSliceActions {
  addEntry: (dictionaryId: DBSerialID, name: LocalizedText) => MutableEntry;
  updateEntry: (dictionaryId: DBSerialID, entryId: DBSerialID, updater: (draft: MutableEntry) => void) => void;
  deleteEntry: (dictionaryId: DBSerialID, entryId: DBSerialID) => void;
  deleteEntries: (dictionaryId: DBSerialID) => void;
}

export interface EntryStoreSlice extends EntryStoreSliceState, EntryStoreSliceActions {}

export const createEntryStoreSlice = (
  initialEntries: DBDictionaryEntry[],
): StateCreator<EntryStoreSlice, [], [], EntryStoreSlice> => {
  const convertedEntries: Record<DBSerialID, Record<DBSerialID, MutableEntry>> = {};
  const entriesIds: Record<DBSerialID, DBSerialID[]> = {};

  initialEntries.forEach((entry) => {
    const dictionaryId = entry.dictionary_id;
    if (!convertedEntries[dictionaryId]) {
      convertedEntries[dictionaryId] = {};
    }
    if (!entriesIds[dictionaryId]) {
      entriesIds[dictionaryId] = [];
    }
    entriesIds[dictionaryId].push(entry.id);
    convertedEntries[dictionaryId][entry.id] = { ...entry, is_new: false };
  });

  return (set) => ({
    dbEntries: initialEntries,
    entries: convertedEntries,
    entriesIds: entriesIds,
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
          // Add new entry id to entriesIds
          if (!draft.entriesIds[dictionaryId]) {
            draft.entriesIds[dictionaryId] = [];
          }
          draft.entriesIds[dictionaryId].push(newEntry.id);
          draft.entries[dictionaryId][newEntry.id] = newEntry;
          draft.temporaryEntryId--;
        }),
      );

      return newEntry;
    },

    updateEntry: (dictionaryId: DBSerialID, entryId: DBSerialID, updater: (draft: MutableEntry) => void) => {
      set(
        produce((draft: EntryStoreSlice) => {
          if (dictionaryId && draft.entries[dictionaryId] && draft.entries[dictionaryId][entryId]) {
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
          // Remove entry id from entriesIds
          draft.entriesIds[dictionaryId] = draft.entriesIds[dictionaryId].filter((id) => id !== entryId);
        }),
      );
    },

    deleteEntries: (dictionaryId: DBSerialID) => {
      set(
        produce((draft: EntryStoreSlice) => {
          if (!draft.entries[dictionaryId]) return;

          Object.values(draft.entries[dictionaryId]).forEach((entry) => {
            if (!entry.is_new) {
              draft.deletedEntryIds.push(entry.id);
            }
          });

          delete draft.entries[dictionaryId];
          draft.entriesIds[dictionaryId] = [];
        }),
      );
    },
  });
};
