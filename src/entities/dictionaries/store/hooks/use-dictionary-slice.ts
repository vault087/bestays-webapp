import { StoreApi, useStore } from "zustand";
import {
  DictionaryOnlyStoreSlice,
  DictionaryOnlyStoreSliceActions,
} from "@/entities/dictionaries/store/slices/dictionary.slice";
import { useStoreContext } from "@/stores";

export function useDictionaryOnlySliceContext(): StoreApi<DictionaryOnlyStoreSlice> {
  return useStoreContext() as StoreApi<DictionaryOnlyStoreSlice>;
}

// Slice-specific hooks that work with any store implementing the slice
export function useDictionaryOnlySlice<T>(selector: (state: DictionaryOnlyStoreSlice) => T): T {
  const store = useDictionaryOnlySliceContext();
  return useStore(store, selector);
}

export function useDictionaryOnlySliceActions(): DictionaryOnlyStoreSliceActions {
  const store = useDictionaryOnlySliceContext();
  return store.getState();
}
