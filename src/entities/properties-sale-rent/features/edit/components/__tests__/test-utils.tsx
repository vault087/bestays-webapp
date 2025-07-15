import { render } from "@testing-library/react";
import React, { ReactNode } from "react";
import { enhancedMockDictionaries, enhancedMockEntries } from "@/entities/dictionaries/mocks/enhanced-mock-data";
import { Property, DictionaryProvider, InitialPropertyProvider } from "@/entities/properties-sale-rent/";
import {
  createMockProperty,
  testProperty,
} from "@/entities/properties-sale-rent/features/edit/mocks/property-mock-data";

// Combined test provider for field components
export function FieldTestProvider({
  children,
  property = testProperty,
  onPropertyUpdate = jest.fn(),
}: {
  children: ReactNode;
  property?: Property;
  onPropertyUpdate?: (updater: (draft: Property) => void) => void;
}) {
  return (
    <DictionaryProvider dictionaries={enhancedMockDictionaries} entries={enhancedMockEntries}>
      <InitialPropertyProvider initialProperty={property} updateProperty={onPropertyUpdate}>
        {children}
      </InitialPropertyProvider>
    </DictionaryProvider>
  );
}

// Render with combined providers
export function renderWithFieldProviders(
  ui: ReactNode,
  options?: {
    property?: Property;
    onPropertyUpdate?: (updater: (draft: Property) => void) => void;
  },
) {
  const property = options?.property || testProperty;
  const onPropertyUpdate = options?.onPropertyUpdate || jest.fn();

  return {
    ...render(
      <FieldTestProvider property={property} onPropertyUpdate={onPropertyUpdate}>
        {ui}
      </FieldTestProvider>,
    ),
    mockUpdateProperty: onPropertyUpdate,
  };
}

// Hook wrapper for renderHook
export function withFieldProviders(options?: {
  property?: Property;
  onPropertyUpdate?: (updater: (draft: Property) => void) => void;
}) {
  const property = options?.property || testProperty;
  const onPropertyUpdate = options?.onPropertyUpdate || jest.fn();

  const FieldProviderWrapper = ({ children }: { children: ReactNode }) => (
    <FieldTestProvider property={property} onPropertyUpdate={onPropertyUpdate}>
      {children}
    </FieldTestProvider>
  );

  FieldProviderWrapper.displayName = "FieldProviderWrapper";

  return { wrapper: FieldProviderWrapper, mockUpdateProperty: onPropertyUpdate };
}

// Helper to create custom test properties
export function createTestProperty(overrides?: Partial<Property>): Property {
  return createMockProperty("test-property", overrides);
}
