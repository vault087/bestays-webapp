import { render } from "@testing-library/react";
import React, { ReactNode } from "react";
import { enhancedMockDictionaries, enhancedMockEntries } from "@/entities/dictionaries/mocks/enhanced-mock-data";
import { DictionaryProvider } from "@/entities/properties/components/context/dictionary.context";
import { InitialPropertyProvider } from "@/entities/properties/components/context/initial-property.context";
import { createMockProperty, testProperty } from "@/entities/properties-sale-rent/mocks/property-mock-data";
import { Property } from "@/entities/properties-sale-rent/types/property.type";

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
