import { useContext } from "react";
import { useDebouncedCallback } from "use-debounce";
import { StoreApi, useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { DictionaryFormStore, DictionaryFormStoreActions } from "./dictionary-form.store";
import { DictionaryFormStoreContext } from "./dictionary-form.store.provider";

export function useDictionaryFormStoreContext(): StoreApi<DictionaryFormStore> {
  const context = useContext(DictionaryFormStoreContext);
  if (!context) {
    throw new Error("useStoreContext must be used within a StoreProvider");
  }
  return context;
}

export function useDictionaryFormStore<T>(selector: (state: DictionaryFormStore) => T): T | undefined {
  const store = useDictionaryFormStoreContext();
  return useStore(store, useShallow(selector));
}

export function useDictionaryFormStaticStore(): DictionaryFormStore {
  const store = useDictionaryFormStoreContext();
  return store.getState();
}

export function useDictionaryFormStoreActions(): DictionaryFormStoreActions {
  const store = useDictionaryFormStoreContext();
  const timeout = 300;
  return {
    updateDictionary: useDebouncedCallback(store.getState().updateDictionary, timeout),
    addDictionary: useDebouncedCallback(store.getState().addDictionary, timeout),
    deleteDictionary: useDebouncedCallback(store.getState().deleteDictionary, timeout),
    addEntry: useDebouncedCallback(store.getState().addEntry, timeout),
    updateEntry: useDebouncedCallback(store.getState().updateEntry, timeout),
    deleteEntry: useDebouncedCallback(store.getState().deleteEntry, timeout),
    deleteEntries: useDebouncedCallback(store.getState().deleteEntries, timeout),
  } as DictionaryFormStoreActions;
}
