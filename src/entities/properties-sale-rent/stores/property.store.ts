import { produce } from "immer";
import { StoreApi, createStore } from "zustand";
import { persist } from "zustand/middleware";
import { Property } from "@/entities/properties-sale-rent/types/property.type";

// Dictionary Store State
export interface PropertyStoreState {
  dbProperties: Record<string, Property>;
  properties: Record<string, Property>;
  deletedPropertyIds: string[];
  hasChanged: boolean;
  hasHydrated: boolean;
}

// Dictionary Store Actions
export interface PropertyStoreActions {
  hasHydrated: boolean;
  addProperty: (property: Property) => void;
  updateProperty: (id: string, updater: (draft: Property) => void) => void;
  deleteProperty: (id: string) => void;
}

// Combined store type
export type PropertyStore = PropertyStoreState & PropertyStoreActions;
export type PropertyStoreApi = StoreApi<PropertyStore>;

// Store creator function
export function createPropertyStore(store_id: string, properties: Record<string, Property>): PropertyStoreApi {
  const initialState: PropertyStoreState = {
    dbProperties: properties,
    properties,
    hasHydrated: false,
    hasChanged: false,
    deletedPropertyIds: [],
  };

  return createStore<PropertyStore>()(
    persist(
      (set) => ({
        ...initialState,

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
      }),
      {
        name: `property-store-${store_id}`,
        partialize: (state) => ({
          dbProperties: state.dbProperties,
          properties: state.properties,
          deletedPropertyIds: state.deletedPropertyIds,
          hasChanged: state.hasChanged,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.hasHydrated = true;
          }
        },
      },
    ),
  );
}
