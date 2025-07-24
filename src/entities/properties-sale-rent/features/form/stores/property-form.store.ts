"use client";

import { produce } from "immer";
import { StoreApi, createStore } from "zustand";
import { persist } from "zustand/middleware";
import { DBProperty, MutableProperty } from "@/entities/properties-sale-rent/";
import { generateUUID } from "@/utils/generate-uuid";

// MutableDictionary Store State
export interface PropertyFormStoreState {
  dbProperty: DBProperty;
  property: MutableProperty;
  hydrated: boolean;
  resetKey: string;
}

// MutableDictionary Store Actions
export interface PropertyFormStoreActions {
  updateProperty: (updater: (draft: MutableProperty) => void) => void;
  reset: () => void;
}

// Combined store type
export type PropertyFormStore = PropertyFormStoreState & PropertyFormStoreActions;

// Store creator function
export function createPropertyFormStore(store_id: string, property: DBProperty): StoreApi<PropertyFormStore> {
  function buildInitialState(initialProperty: DBProperty): PropertyFormStoreState {
    return {
      dbProperty: initialProperty,
      property: { ...initialProperty, is_new: true },
      hydrated: false,
      resetKey: generateUUID(),
    };
  }

  return createStore<PropertyFormStore>()(
    persist(
      (set) => ({
        ...buildInitialState(property),

        updateProperty: (updater: (draft: MutableProperty) => void) =>
          set(
            produce((state: PropertyFormStore) => {
              updater(state.property);
            }),
          ),

        reset: () =>
          set((state) => {
            return {
              ...state,
              ...buildInitialState(state.dbProperty),
              hydrated: state.hydrated,
              resetKey: generateUUID(), // Force component re-render
            };
          }),
      }),
      {
        name: `property-store-${store_id}`,
        partialize: (state) => ({
          dbProperty: state.dbProperty,
          property: state.property,
          resetKey: state.resetKey,
          images: state.images,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            // Clear any persisted base64 images (legacy data)
            if (state.property?.images) {
              state.property.images = state.property.images.filter((img) => !img.url.startsWith("data:"));
            }
            state.hydrated = true;
          }
        },
      },
    ),
  );
}
