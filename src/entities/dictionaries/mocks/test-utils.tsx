import { render } from "@testing-library/react";
import React, { ReactNode } from "react";
import { DictionaryStoreProvider } from "@/entities/dictionaries/stores/contexts/dictionary-store.context";
import { createStandaloneDictionaryStore, DictionaryStoreApi } from "@/entities/dictionaries/stores/dictionary.store";
import { Dictionary, DictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";
import { mockDictionaries, mockEntries } from "./dictionary-mock-data";

// Create a test dictionary store with optional initial data
export function createTestDictionaryStore(
  initialDictionaries: Record<number, Dictionary> = {},
  initialEntries: Record<number, Record<number, DictionaryEntry>> = {},
): DictionaryStoreApi {
  return createStandaloneDictionaryStore(
    Object.keys(initialDictionaries).length > 0 ? initialDictionaries : mockDictionaries,
    Object.keys(initialEntries).length > 0 ? initialEntries : mockEntries,
  );
}

// Test Provider component for tests (matches test expectations)
export function DictionaryStoreTestProvider({ children }: { children: ReactNode }) {
  const testStore = createTestDictionaryStore();
  return <DictionaryStoreProvider store={testStore}>{children}</DictionaryStoreProvider>;
}

// Render with dictionary providers
export function renderWithDictionaryProviders(ui: ReactNode, store?: DictionaryStoreApi) {
  const testStore = store || createTestDictionaryStore();

  return {
    ...render(<DictionaryStoreProvider store={testStore}>{ui}</DictionaryStoreProvider>),
    store: testStore,
  };
}

// Dictionary Provider wrapper for renderHook
export function withDictionaryProvider(store?: DictionaryStoreApi) {
  const testStore = store || createTestDictionaryStore();

  const DictionaryProviderWrapper = ({ children }: { children: ReactNode }) => (
    <DictionaryStoreProvider store={testStore}>{children}</DictionaryStoreProvider>
  );

  DictionaryProviderWrapper.displayName = "DictionaryProviderWrapper";

  return DictionaryProviderWrapper;
}
