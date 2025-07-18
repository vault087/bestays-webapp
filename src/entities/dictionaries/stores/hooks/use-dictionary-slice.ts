import { StoreApi, useStore } from "zustand";
import { DictionaryStoreSlice } from "@/entities/dictionaries/stores/dictionary.slice";
import { useStoreContext } from "@/stores";

export function useDictionarySlice(): StoreApi<DictionaryStoreSlice> {
  const store = useStoreContext() as StoreApi<DictionaryStoreSlice>;
  if (!store) {
    throw new Error("useDictionarySlice must be used within a DictionaryStoreProvider");
  }
  return store;
}

// Slice-specific hooks that work with any store implementing the slice
export function useDictionarySliceSelector<T>(selector: (state: DictionaryStoreSlice) => T): T {
  const store = useDictionarySlice();
  return useStore(store, selector);
}

export function useDictionarySliceGetState(): DictionaryStoreSlice {
  const store = useDictionarySlice();
  return store.getState();
}
