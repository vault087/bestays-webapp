"use client";

import { ReactNode, createContext } from "react";
import { StoreApi } from "zustand";
import { DictionaryFormStore } from "./dictionary-form.store";
import { useDictionaryFormStore } from "./dictionary-form.store.hooks";

export const DictionaryFormStoreContext = createContext<StoreApi<DictionaryFormStore> | null>(null);

export const DictionaryFormStoreProvider = ({
  children,
  store,
}: {
  children: ReactNode;
  store: StoreApi<DictionaryFormStore>;
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
  const hydrated = useDictionaryFormStore((state) => state.hydrated);

  if (!hydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
