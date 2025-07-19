"use client";

import { ReactNode, createContext } from "react";
import { StoreApi } from "zustand";
import { DictionaryPageStore } from "./dictionary-form.store";
import { useDictionaryFormStore } from "./dictionary-form.store.hooks";

export const DictionaryFormStoreContext = createContext<StoreApi<DictionaryPageStore> | null>(null);

export const DictionaryFormStoreProvider = ({
  children,
  store,
}: {
  children: ReactNode;
  store: StoreApi<DictionaryPageStore>;
}) => {
  return <DictionaryFormStoreContext.Provider value={store}>{children}</DictionaryFormStoreContext.Provider>;
};

export function DictionaryFormStoreHydrated({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const hasHydrated = useDictionaryFormStore((state) => state.hydrated);

  if (!hasHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
