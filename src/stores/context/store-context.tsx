"use client";

import { ReactNode, createContext, useContext } from "react";
import { StoreApi } from "zustand";

export const StoreContext = createContext<StoreApi<unknown> | null>(null);

export const StoreProvider = ({ children, store }: { children: ReactNode; store: StoreApi<unknown> }) => {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export function useStoreContext(): StoreApi<unknown> {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStoreContext must be used within a StoreProvider");
  }
  return context;
}
