import { useContext } from "react";
import { StoreApi, useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { DictionaryPageStore } from "./dictionary-form.store";
import { DictionaryFormStoreContext } from "./dictionary-form.store.provider";

export function useDictionaryFormStoreContext(): StoreApi<DictionaryPageStore> {
  const context = useContext(DictionaryFormStoreContext);
  if (!context) {
    throw new Error("useStoreContext must be used within a StoreProvider");
  }
  return context;
}

export function useDictionaryFormStore<T>(selector: (state: DictionaryPageStore) => T): T {
  const store = useDictionaryFormStoreContext();
  return useStore(store, useShallow(selector));
}

export function useDictionaryFormStaticStore(): DictionaryPageStore {
  const store = useDictionaryFormStoreContext();
  return store.getState();
}
