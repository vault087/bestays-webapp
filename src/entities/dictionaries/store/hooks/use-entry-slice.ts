import { StoreApi, useStore } from "zustand";
import { useDictionaryStoreContext } from "@/entities/dictionaries";
import { EntryStoreSlice, EntryStoreSliceActions } from "@/entities/dictionaries/store/slices/entry.slice";

export function useEntrySliceContext(): StoreApi<EntryStoreSlice> {
  return useDictionaryStoreContext() as StoreApi<EntryStoreSlice>;
}

export function useEntrySlice<T>(selector: (state: EntryStoreSlice) => T): T {
  const store = useEntrySliceContext();
  return useStore(store, selector);
}

export function useEntrySliceActions(): EntryStoreSliceActions {
  const store = useEntrySliceContext();
  return store.getState();
}
