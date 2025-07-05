import { render } from "@testing-library/react";
import React, { ReactNode } from "react";
import { PropertyStoreApi, createPropertyStore } from "@/entities/properties-sale-rent/stores";
import { PropertyStoreProvider } from "@/entities/properties-sale-rent/stores/contexts/property-store.context";
import { Property } from "@/entities/properties-sale-rent/types";

// Create a test dictionary store with optional initial data
export function createTestPropertyStore(initialProperties: Record<string, Property> = {}): PropertyStoreApi {
  return createPropertyStore("test-property-store", initialProperties);
}

// Test Provider component for tests (matches test expectations)
export function PropertyStoreTestProvider({ children }: { children: ReactNode }) {
  const testStore = createTestPropertyStore();
  return <PropertyStoreProvider store={testStore}>{children}</PropertyStoreProvider>;
}

// Render with dictionary providers
export function renderWithPropertyProviders(ui: ReactNode, store?: PropertyStoreApi) {
  const testStore = store || createTestPropertyStore();

  return {
    ...render(<PropertyStoreProvider store={testStore}>{ui}</PropertyStoreProvider>),
    store: testStore,
  };
}

// Dictionary Provider wrapper for renderHook
export function withPropertyProvider(store?: PropertyStoreApi) {
  const testStore = store || createTestPropertyStore();

  const PropertyProviderWrapper = ({ children }: { children: ReactNode }) => (
    <PropertyStoreProvider store={testStore}>{children}</PropertyStoreProvider>
  );

  PropertyProviderWrapper.displayName = "PropertyProviderWrapper";

  return PropertyProviderWrapper;
}
