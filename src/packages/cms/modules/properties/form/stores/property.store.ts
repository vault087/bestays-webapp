import { produce } from "immer";
import { StateCreator, createStore, StoreApi } from "zustand";
import { generateUUID } from "@shared-ui/lib/utils";
import { createOptionStore, type OptionStore } from "@cms/modules/properties/form/property-options";
import type { FormProperty } from "@cms/modules/properties/form/types";
import type { PropertyOption } from "@cms/modules/properties/property.types";

// ✅ Property Store State & Actions Types
export interface PropertyStoreState {
  properties: Record<string, FormProperty>;
  sorting: Record<string, number>; // UUID: Index
  hasChanged: boolean;
  deletedPropertyIds: string[];
}

export interface PropertyStoreActions {
  addProperty: (property: FormProperty) => void;
  updateProperty: (id: string, updater: (draft: FormProperty) => void) => void;
  deleteProperty: (id: string) => void;
  cloneProperty: (id: string) => void;
  reorderProperties: (sourceIndex: number, destinationIndex: number) => void;
}

export type PropertyStore = PropertyStoreState & PropertyStoreActions & OptionStore;

// ✅ STORE CREATOR - Following Zustand patterns (like counterStoreCreator)
export const createPropertyStore: StateCreator<PropertyStore> = (set, get, api) => ({
  // Initial state
  properties: {},
  sorting: {},
  deletedPropertyIds: [],
  ...createOptionStore(set, get, api),

  // Actions
  updateProperty: (id: string, updater: (draft: FormProperty) => void) =>
    set(
      produce((state: PropertyStore) => {
        if (state.properties[id]) {
          updater(state.properties[id]);
        }
        state.hasChanged = true;
      }),
    ),

  reorderProperties: (sourceIndex: number, destinationIndex: number) =>
    set(
      produce((state: PropertyStore) => {
        // Get current ordered IDs
        const orderedIds = Object.entries(state.sorting)
          .sort(([, a], [, b]) => (a as number) - (b as number))
          .map(([id]) => id);

        // Reorder array
        const [movedId] = orderedIds.splice(sourceIndex, 1);
        orderedIds.splice(destinationIndex, 0, movedId);

        // Single atomic update - most efficient
        state.sorting = Object.fromEntries(orderedIds.map((id, index) => [id, index]));
        state.hasChanged = true;
      }),
    ),

  addProperty: (property: FormProperty) =>
    set(
      produce((state: PropertyStore) => {
        state.properties[property.id] = property;

        const maxOrder = Math.max(...(Object.values(state.sorting) as number[]), -1);
        state.sorting[property.id] = maxOrder + 1;

        state.options[property.id] = {};
        state.hasChanged = true;
      }),
    ),

  /**
   * 🗑️ Delete property and cleanup related data
   *
   * 🚨 CRITICAL: Must safely handle property deletion and track for DB deletion
   */
  deleteProperty: (id: string) =>
    set(
      produce((state: PropertyStore) => {
        // Safely check if property exists and track for deletion if it's from DB
        const property = state.properties[id];
        if (property && !property.is_new) {
          state.deletedPropertyIds.push(id);
        }

        // Track option IDs for deletion if they're from the database
        if (state.options[id]) {
          const options = Object.values(state.options[id]) as PropertyOption[];
          options.forEach((option) => {
            if (!option.is_new) {
              state.deletedOptionIds.push(option.option_id);
            }
          });
        }

        // Clean up all references
        delete state.properties[id];
        delete state.sorting[id];
        delete state.options[id];
        state.hasChanged = true;
      }),
    ),

  /**
   * 📋 Clone property with new ID and adjusted sorting
   */
  cloneProperty: (id: string) =>
    set(
      produce((state: PropertyStore) => {
        const originalProperty = state.properties[id];
        if (!originalProperty) return;

        // Create a deep copy of the property
        const clonedProperty: FormProperty = {
          ...originalProperty,
          id: generateUUID(),
          is_new: true,
        };

        // Add to properties
        state.properties[clonedProperty.id] = clonedProperty;

        // Set sorting to be right after the original property
        const originalOrder = state.sorting[id];

        // Shift all properties after the original one position down
        Object.keys(state.sorting).forEach((propertyId) => {
          if (state.sorting[propertyId] > originalOrder) {
            state.sorting[propertyId] += 1;
          }
        });

        // Insert clone right after original
        state.sorting[clonedProperty.id] = originalOrder + 1;

        // Initialize empty property options for the clone
        state.options[clonedProperty.id] = {};

        // If original had options, clone them too
        if (state.options[id]) {
          state.options[clonedProperty.id] = { ...state.options[id] };
        }
        state.hasChanged = true;
      }),
    ),
});

// ✅ UTILITY: Create standalone property store (for tests and simple usage)
export function createStandalonePropertyStore(
  initialProperties: Record<string, FormProperty> = {},
): StoreApi<PropertyStore> {
  const store = createStore<PropertyStore>()(createPropertyStore);

  // Initialize with provided properties
  if (Object.keys(initialProperties).length > 0) {
    store.setState({ properties: initialProperties });
  }

  return store;
}
