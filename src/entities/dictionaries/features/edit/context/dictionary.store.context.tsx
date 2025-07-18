"use client";

import { StoreApi } from "zustand";
import { DictionaryOnlyStoreSlice } from "@/entities/dictionaries/store";
import { useStoreContext } from "@/stores";

// import { ReactNode, createContext, useContext } from "react";
// import { DictionaryStoreApi } from "@/entities/dictionaries/store/dictionary.store";

// // Create context with proper type safety
// export const DictionaryStoreContext = createContext<DictionaryStoreApi | null>(null);

// // Store Provider props
// export interface DictionaryStoreProviderProps {
//   children: ReactNode;
//   store: DictionaryStoreApi;
// }

// // Store Provider component
// export const DictionaryStoreProvider = ({ children, store }: DictionaryStoreProviderProps) => {
//   return <DictionaryStoreContext.Provider value={store}>{children}</DictionaryStoreContext.Provider>;
// };

// Context hook
export function useDictionaryStoreContext(): StoreApi<DictionaryOnlyStoreSlice> {
  const store = useStoreContext() as StoreApi<DictionaryOnlyStoreSlice>;
  if (!store) {
    throw new Error("useDictionaryStoreContext must be used within a DictionaryStoreProvider");
  }
  return store;
}
