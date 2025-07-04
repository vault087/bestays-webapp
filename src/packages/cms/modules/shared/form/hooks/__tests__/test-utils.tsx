import { render, cleanup, RenderResult } from "@testing-library/react";
import React, { ReactNode } from "react";
import type { StoreApi } from "zustand";
import { CMSTranslationContextProvider } from "@cms/i18n/use-cms-translation.hooks";
import { createCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store";
import { CanvasStoreContext } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.context";
import { createLayoutStore } from "@cms/modules/domain-editor/stores/layout-store/layout.store";
import { LayoutStoreContext } from "@cms/modules/domain-editor/stores/layout-store/layout.store.context";
import { PropertyIdProvider } from "@cms/modules/properties/form/contexts/property-id.context";
import { PropertyStoreProvider } from "@cms/modules/properties/form/contexts/property-store.context";
import type { PropertyStore } from "@cms/modules/properties/form/stores/property.store";
import { FormProperty } from "@cms/modules/properties/form/types";
import { createTestPropertyStore } from "./mock-factories";

// Mock translation provider
export const MockCMSTranslationContextProvider = ({ children }: { children: ReactNode }) => (
  <CMSTranslationContextProvider namespace="cms">{children}</CMSTranslationContextProvider>
);

// Mock locale provider
export const MockCustomLocaleProvider = ({ children }: { children: ReactNode }) => (
  <div data-testid="mock-locale-provider">{children}</div>
);

// Create a mock property for testing
export const createMockProperty = (overrides: Partial<FormProperty> = {}): FormProperty => ({
  id: "test-property",
  group_id: null,
  name: { en: "Test Property" },
  description: { en: "Test Description" },
  code: "test_property",
  is_locked: false,
  type: "text",
  meta: { type: "text" },
  is_required: false,
  is_private: false,
  is_new: false,
  ...overrides,
});

// Re-export cleanup for use in tests
export { cleanup };

// Helper function to render components with all necessary providers
export const renderWithProviders = (
  children: ReactNode,
  options: {
    customProperty?: FormProperty;
    propertyId?: string;
    store?: StoreApi<PropertyStore>;
  } = {},
): RenderResult & { store: StoreApi<PropertyStore> } => {
  // Clean up before each render to prevent test pollution
  cleanup();

  const {
    customProperty = createMockProperty(),
    propertyId = customProperty.id,
    store = createTestPropertyStore({ [propertyId]: customProperty }),
  } = options;

  const canvasStore = createCanvasStore("test-domain", "en", [customProperty]);
  const layoutStore = createLayoutStore("test-domain");

  return {
    ...render(
      <CMSTranslationContextProvider namespace="cms">
        <CanvasStoreContext.Provider value={canvasStore}>
          <LayoutStoreContext.Provider value={layoutStore}>
            <PropertyStoreProvider store={store}>
              <PropertyIdProvider propertyId={propertyId}>{children}</PropertyIdProvider>
            </PropertyStoreProvider>
          </LayoutStoreContext.Provider>
        </CanvasStoreContext.Provider>
      </CMSTranslationContextProvider>,
    ),
    store,
  };
};
