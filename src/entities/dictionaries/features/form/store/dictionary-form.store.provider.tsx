"use client";

import { ReactNode, createContext } from "react";
import { StoreApi } from "zustand";
import { DictionaryPageStore } from "./dictionary-form.store";

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
