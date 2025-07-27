import { produce } from "immer";
import { StateCreator } from "zustand";
import { DBSerialID, DBTemporarySerialID, generateTemporarySerialId } from "@/entities/common/";
import { DBDictionaryEntry, MutableEntry } from "@/entities/dictionaries/";

export interface EntriesStoreSliceState {
  dbEntries: DBDictionaryEntry[];
  entries: Record<DBSerialID, Record<DBSerialID, MutableEntry>>; // dictionaryId -> entryId -> entry
  entriesIds: Record<DBSerialID, DBSerialID[]>; // dictionaryId -> entryIds
  deletedEntryIds: DBSerialID[];
  temporaryEntryId: DBTemporarySerialID;
}

// Entry Store Actions
export interface EntriesStoreSliceActions {
  addEntry: (entry: DBDictionaryEntry) => void;
  updateEntry: (dictionaryId: DBSerialID, entryId: DBSerialID, updater: (draft: MutableEntry) => void) => void;
  deleteEntry: (dictionaryId: DBSerialID, entryId: DBSerialID) => void;
  deleteEntries: (dictionaryId: DBSerialID) => void;
}

export interface EntriesStoreSlice extends EntriesStoreSliceState, EntriesStoreSliceActions {}

export const createEntriesStoreSlice = (
  initialEntries: DBDictionaryEntry[],
): StateCreator<EntriesStoreSlice, [], [], EntriesStoreSlice> => {
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
    convertedEntries[dictionaryId][entry.id] = entry;
  });

  return (set) => ({
    dbEntries: initialEntries,
    entries: convertedEntries,
    entriesIds: entriesIds,
    deletedEntryIds: [],
    temporaryEntryId: generateTemporarySerialId(),

    addEntry: (entry: DBDictionaryEntry) => {
      const dictionaryId = entry.dictionary_id;
      set(
        produce((draft: EntriesStoreSlice) => {
          if (!draft.entries[dictionaryId]) {
            draft.entries[dictionaryId] = {};
          }
          // Add new entry id to entriesIds
          if (!draft.entriesIds[dictionaryId]) {
            draft.entriesIds[dictionaryId] = [];
          }
          draft.entriesIds[dictionaryId].push(entry.id);
          draft.entries[dictionaryId][entry.id] = entry;
          draft.temporaryEntryId--;
        }),
      );
    },

    updateEntry: (dictionaryId: DBSerialID, entryId: DBSerialID, updater: (draft: MutableEntry) => void) => {
      set(
        produce((draft: EntriesStoreSlice) => {
          if (dictionaryId && draft.entries[dictionaryId] && draft.entries[dictionaryId][entryId]) {
            updater(draft.entries[dictionaryId][entryId]);
          }
        }),
      );
    },

    deleteEntry: (dictionaryId: DBSerialID, entryId: DBSerialID) => {
      set(
        produce((draft: EntriesStoreSlice) => {
          if (!dictionaryId) return;
          if (!draft.entries[dictionaryId]) return;

          const entry = draft.entries[dictionaryId][entryId];
          if (!entry) return;

          draft.deletedEntryIds.push(entryId);

          delete draft.entries[dictionaryId][entryId];
          // Remove entry id from entriesIds
          draft.entriesIds[dictionaryId] = draft.entriesIds[dictionaryId].filter((id) => id !== entryId);
        }),
      );
    },

    deleteEntries: (dictionaryId: DBSerialID) => {
      set(
        produce((draft: EntriesStoreSlice) => {
          if (!draft.entries[dictionaryId]) return;

          Object.values(draft.entries[dictionaryId]).forEach((entry) => {
            draft.deletedEntryIds.push(entry.id);
          });

          delete draft.entries[dictionaryId];
          draft.entriesIds[dictionaryId] = [];
        }),
      );
    },
  });
};
