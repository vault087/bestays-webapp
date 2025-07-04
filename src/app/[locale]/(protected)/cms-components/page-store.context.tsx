"use client";

import { createContext, useContext, useRef, ReactNode } from "react";
import { StoreApi } from "zustand";
import { createPageStore, PageStore } from "./store";

// ✅ Page Store Context
export const PageStoreContext = createContext<StoreApi<PageStore> | null>(null);

// ✅ Page Store Provider
export interface PageStoreProviderProps {
  children: ReactNode;
}

export const PageStoreProvider = ({ children }: PageStoreProviderProps) => {
  const storeRef = useRef<StoreApi<PageStore> | null>(null);

  if (!storeRef.current) {
    storeRef.current = createPageStore();
  }

  return <PageStoreContext.Provider value={storeRef.current}>{children}</PageStoreContext.Provider>;
};

// ✅ Page Store Hook
export const usePageStore = (): StoreApi<PageStore> => {
  const storeContext = useContext(PageStoreContext);

  if (storeContext === null) {
    throw new Error("usePageStore must be used within PageStoreProvider");
  }

  return storeContext;
};
