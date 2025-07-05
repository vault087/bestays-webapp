import { produce } from "immer";
import { StateCreator, StoreApi } from "zustand";
import { Property } from "@/entities/properties-sale-rent/types/property.type";

// Dictionary Store State
export interface PropertyStoreState {
  properties: Record<string, Property>;
  hasChanged: boolean;
  deletedPropertyIds: string[];
}

// Dictionary Store Actions
export interface PropertyStoreActions {
  addProperty: (property: Property) => void;
  updateProperty: (id: string, updater: (draft: Property) => void) => void;
  deleteProperty: (id: string) => void;
}

// Combined store type
export type PropertyStore = PropertyStoreState & PropertyStoreActions;
export type PropertyStoreApi = StoreApi<PropertyStore>;

// Store creator function
export const createPropertyStore: StateCreator<PropertyStore> = (set) => ({
  // Initial state
  properties: {},
  hasChanged: false,
  deletedPropertyIds: [],

  // Property actions
  addProperty: (property: Property) =>
    set(
      produce((state: PropertyStore) => {
        state.properties[property.id] = property;
        state.hasChanged = true;
      }),
    ),

  updateProperty: (id: string, updater: (draft: Property) => void) =>
    set(
      produce((state: PropertyStore) => {
        if (state.properties[id]) {
          updater(state.properties[id]);
          state.hasChanged = true;
        }
      }),
    ),

  deleteProperty: (id: string) =>
    set(
      produce((state: PropertyStore) => {
        // Track for deletion if it's from DB
        const property = state.properties[id];
        if (property && !property.is_new) {
          state.deletedPropertyIds.push(id);
        }

        // Clean up references
        delete state.properties[id];
        state.hasChanged = true;
      }),
    ),
});
