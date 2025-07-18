import { StoreApi, useStore } from "zustand";
import { EntryStoreSlice } from "@/entities/dictionaries/stores/entry.slice";
import { useDictionarySlice } from "./use-dictionary-slice";

export function useEntrySlice(): StoreApi<EntryStoreSlice> {
  return useDictionarySlice() as StoreApi<EntryStoreSlice>;
}

export function useEntrySliceSelector<T>(selector: (state: EntryStoreSlice) => T): T {
  const store = useEntrySlice();
  return useStore(store, selector);
}

export function useEntrySliceGetState(): EntryStoreSlice {
  const store = useEntrySlice();
  return store.getState();
}
