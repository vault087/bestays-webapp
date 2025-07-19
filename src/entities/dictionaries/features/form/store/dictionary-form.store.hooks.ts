import { useContext } from "react";
import { StoreApi, useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { DictionaryFormStore } from "./dictionary-form.store";
import { DictionaryFormStoreContext } from "./dictionary-form.store.provider";

export function useDictionaryFormStoreContext(): StoreApi<DictionaryFormStore> {
  const context = useContext(DictionaryFormStoreContext);
  if (!context) {
    throw new Error("useStoreContext must be used within a StoreProvider");
  }
  return context;
}

export function useDictionaryFormStore<T>(selector: (state: DictionaryFormStore) => T): T {
  const store = useDictionaryFormStoreContext();
  return useStore(store, useShallow(selector));
}

export function useDictionaryFormStaticStore(): DictionaryFormStore {
  const store = useDictionaryFormStoreContext();
  return store.getState();
}
