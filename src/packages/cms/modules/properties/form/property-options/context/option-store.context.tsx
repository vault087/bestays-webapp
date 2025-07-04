"use client";

import { type ReactNode, createContext } from "react";
import { StoreApi } from "zustand";
import type { OptionStore } from "@cms/modules/properties/form/property-options";

// ✅ Type definition for our store API
export type OptionStoreApi = StoreApi<OptionStore>;

// ✅ Store Context
export const OptionStoreContext = createContext<OptionStoreApi | null>(null);

// ✅ Store Provider - only accepts an external store
export interface OptionStoreProviderProps {
  children: ReactNode;
  store: OptionStoreApi;
}

export const OptionStoreProvider = ({ children, store }: OptionStoreProviderProps) => {
  return <OptionStoreContext.Provider value={store}>{children}</OptionStoreContext.Provider>;
};
