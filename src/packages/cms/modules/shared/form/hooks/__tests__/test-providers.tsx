/**
 * @fileoverview Test provider components and mock contexts
 */
import { render, RenderResult } from "@testing-library/react";
import React, { ReactNode } from "react";
import { StoreApi } from "zustand";
import { PropertyStoreProvider, PropertyIdProvider } from "@cms/modules/properties/form/contexts";
import { PropertyStore } from "@cms/modules/properties/form/stores/property.store";
import type { FormProperty } from "@cms/modules/properties/form/types";
import { createMockProperty, createTestPropertyStore } from "./mock-factories";

// Mock CMS Translation Context Provider
export const MockCMSTranslationContextProvider = ({ children }: { children: ReactNode }) => {
  return <div data-testid="mock-cms-translation-provider">{children}</div>;
};

// Mock Custom Locale Provider
export const MockCustomLocaleProvider = ({ children }: { children: ReactNode }) => {
  return <div data-testid="mock-custom-locale-provider">{children}</div>;
};

/**
 * Options for renderWithProviders
 */
interface RenderWithProvidersOptions {
  store?: StoreApi<PropertyStore>;
  customProperty?: FormProperty;
  propertyId?: string;
}

/**
 * Renders component with all required providers for property form components
 */
export function renderWithProviders(
  component: React.ReactElement,
  options: RenderWithProvidersOptions = {},
): RenderResult {
  const {
    customProperty,
    propertyId = customProperty?.id || "test-property-default",
    store = (() => {
      const mockProperty = customProperty || createMockProperty({ id: propertyId });
      return createTestPropertyStore({ [propertyId]: mockProperty });
    })(),
  } = options;

  return render(
    <MockCMSTranslationContextProvider>
      <MockCustomLocaleProvider>
        <PropertyStoreProvider store={store}>
          <PropertyIdProvider propertyId={propertyId}>{component}</PropertyIdProvider>
        </PropertyStoreProvider>
      </MockCustomLocaleProvider>
    </MockCMSTranslationContextProvider>,
  );
}
