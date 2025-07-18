import { render } from "@testing-library/react";
import React, { ReactNode } from "react";
import { DictionaryStoreProvider } from "@/entities/dictionaries/stores/contexts/dictionary-store.context";
import { createDictionaryStore, DictionaryStoreApi } from "@/entities/dictionaries/stores/dictionary.store";
import { mockDictionaries, mockEntries } from "./dictionary-mock-data";

// Test Provider component for tests (matches test expectations)
export function DictionaryStoreTestProvider({ children }: { children: ReactNode }) {
  const testStore = createDictionaryStore(mockDictionaries, mockEntries);
  return <DictionaryStoreProvider store={testStore}>{children}</DictionaryStoreProvider>;
}

// Render with dictionary providers
export function renderWithDictionaryProviders(ui: ReactNode, store?: DictionaryStoreApi) {
  const testStore = store || createDictionaryStore(mockDictionaries, mockEntries);

  return {
    ...render(<DictionaryStoreProvider store={testStore}>{ui}</DictionaryStoreProvider>),
    store: testStore,
  };
}

// MutableDictionary Provider wrapper for renderHook
export function withDictionaryProvider(store?: DictionaryStoreApi) {
  const testStore = store || createDictionaryStore(mockDictionaries, mockEntries);

  const DictionaryProviderWrapper = ({ children }: { children: ReactNode }) => (
    <DictionaryStoreProvider store={testStore}>{children}</DictionaryStoreProvider>
  );

  DictionaryProviderWrapper.displayName = "DictionaryProviderWrapper";

  return DictionaryProviderWrapper;
}
