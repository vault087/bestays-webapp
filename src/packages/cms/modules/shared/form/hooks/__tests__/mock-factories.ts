/**
 * @fileoverview Mock factory functions for creating test data
 */
import { StoreApi } from "zustand";
import { createStandalonePropertyStore, PropertyStore } from "@cms/modules/properties/form/stores/property.store";
import type { FormProperty } from "@cms/modules/properties/form/types";

// Re-export ValidityPair for convenience
export type { ValidityPair } from "./test-utilities";

/**
 * Creates a mock FormProperty with sensible defaults
 */
export function createMockProperty(overrides: Partial<FormProperty> = {}): FormProperty {
  const defaultProperty: FormProperty = {
    id: `test-property-${Date.now()}`,
    type: "text",
    code: "test_code",
    name: { en: "Test Property" },
    description: { en: "Test Description" },
    is_required: false,
    is_locked: false,
    is_private: false,
    is_new: false,
    meta: { type: "text", multiline: false },
    ...overrides,
  };

  return defaultProperty;
}

/**
 * Creates a test property store with optional initial properties
 */
export function createTestPropertyStore(initialProperties: Record<string, FormProperty> = {}): StoreApi<PropertyStore> {
  return createStandalonePropertyStore(initialProperties);
}

/**
 * Creates an input event for testing
 */
export function createInputEvent(value: string): React.ChangeEvent<HTMLInputElement> {
  return {
    target: { value },
    currentTarget: { value },
  } as React.ChangeEvent<HTMLInputElement>;
}
