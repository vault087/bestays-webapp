import { produce, applyPatches, enablePatches, produceWithPatches } from "immer";
import { StateCreator } from "zustand";
import { DictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";
import { DBSerialID, DBTemporarySerialID } from "@/entities/dictionaries/types/shared-db.types";
import { LocalizedText } from "@/entities/localized-text";

enablePatches();

export interface DictionaryEntryEditStoreState {
  entries: Record<DBSerialID, Record<DBSerialID, DictionaryEntry>>;
  entryChanges: Record<DBSerialID, Record<DBSerialID, Partial<DictionaryEntry>>>;
  deletedEntryIds: DBSerialID[];
}

export interface DictionaryEntryEditStoreStateInternal {
  temporaryEntryId: DBTemporarySerialID;
}

// Dictionary Store Actions
export interface DictionaryEntryEditStoreActions {
  addEntry: (dictionaryId: DBSerialID, name: LocalizedText) => void;
  updateEntry: (dictionaryId: DBSerialID, entryId: DBSerialID, updater: (draft: DictionaryEntry) => void) => void;
  deleteEntry: (dictionaryId: DBSerialID, entryId: DBSerialID) => void;
}

export interface DictionaryEntryEditStore
  extends DictionaryEntryEditStoreState,
    DictionaryEntryEditStoreActions,
    DictionaryEntryEditStoreStateInternal {}

export const createDictionaryEntryEditSlice: StateCreator<DictionaryEntryEditStore> = (set, get) => ({
  entries: {},
  entryChanges: {},
  deletedEntryIds: [],
  temporaryEntryId: -1,

  addEntry: (dictionaryId: DBSerialID, name: LocalizedText) =>
    set((state) => {
      const newEntry = {
        id: state.temporaryEntryId,
        code: "",
        name,
        is_new: true,
        dictionary_id: dictionaryId,
      };

      state.entries[newEntry.id] = newEntry;
      state.entryChanges[newEntry.id] = newEntry;
      state.temporaryEntryId--;

      return state;
    }),

  updateEntry: (dictionaryId: DBSerialID, entryId: DBSerialID, updater: (draft: DictionaryEntry) => void) => {
    const [nextState, patches] = produceWithPatches(get(), (draft: DictionaryEntryEditStore) => {
      if (!dictionaryId || !draft.entries[dictionaryId]) {
        return;
      }
      updater(draft.entries[dictionaryId][entryId]);
    });

    set(nextState);

    if (patches.length > 0) {
      set((state) => {
        if (!state.entryChanges[dictionaryId]) {
          state.entryChanges[dictionaryId] = {};
        }
        state.entryChanges[dictionaryId] = applyPatches(state.entryChanges[dictionaryId], patches);
        return state;
      });
    }
  },

  deleteEntry: (dictionaryId: DBSerialID, entryId: DBSerialID) => {
    if (!dictionaryId || !get().entries[dictionaryId]) {
      return;
    }

    set(
      produce((state: DictionaryEntryEditStore) => {
        // Track for deletion if it's from DB
        const entry = state.entries[dictionaryId][entryId];
        if (entry && !entry.is_new) {
          state.deletedEntryIds.push(entryId);
        }

        // Clean up references
        delete state.entries[dictionaryId][entryId];
        delete state.entryChanges[dictionaryId][entryId];

        return state;
      }),
    );
  },
});
