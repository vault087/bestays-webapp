import { StoreApi, useStore } from "zustand";
import { useDictionaryStoreContext } from "@/entities/dictionaries";
import {
  DictionaryOnlyStoreSlice,
  DictionaryOnlyStoreSliceActions,
} from "@/entities/dictionaries/store/slices/dictionary-only.slice";

export function useDictionaryOnlySliceContext(): StoreApi<DictionaryOnlyStoreSlice> {
  return useDictionaryStoreContext() as StoreApi<DictionaryOnlyStoreSlice>;
}

// Slice-specific hooks that work with any store implementing the slice
export function useDictionaryOnlySlice<T>(selector: (state: DictionaryOnlyStoreSlice) => T): T {
  const store = useDictionaryOnlySliceContext();
  return useStore(store, selector);
}

export function useDictionaryOnlySliceState<T>(selector: (state: DictionaryOnlyStoreSlice) => T): T {
  const store = useDictionaryOnlySliceContext();
  return useStore(store, selector);
}

export function useDictionaryOnlySliceActions(): DictionaryOnlyStoreSliceActions {
  const store = useDictionaryOnlySliceContext();
  return store.getState();
}
