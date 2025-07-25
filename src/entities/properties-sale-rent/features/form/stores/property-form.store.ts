"use client";

import { produce } from "immer";
import { StoreApi, createStore } from "zustand";
import { persist } from "zustand/middleware";
import {
  createImageStoreSlice,
  ImageStoreSliceActions,
  ImageStoreSliceState,
} from "@/entities/media/stores/images.slice";
import { DBProperty, MutableProperty } from "@/entities/properties-sale-rent/";
import { convertToMutableProperty } from "@/entities/properties-sale-rent/features/form/types/mutable-property.types";
import { generateUUID } from "@/utils/generate-uuid";

export interface PropertyFormStoreState extends ImageStoreSliceState {
  freshProperty?: DBProperty | undefined;
  initialProperty?: DBProperty | undefined;
  property: MutableProperty;
  hydrated: boolean;
  resetKey: string;
}

// MutableDictionary Store Actions
export interface PropertyFormStoreActions extends ImageStoreSliceActions {
  updateProperty: (updater: (draft: MutableProperty) => void) => void;
  reset: (property?: DBProperty) => void;
}

// Combined store type
export type PropertyFormStore = PropertyFormStoreState & PropertyFormStoreActions;

// Store creator function
export function createPropertyFormStore(store_id: string, property?: DBProperty): StoreApi<PropertyFormStore> {
  // Extract images from property for slice initialization
  const initialImages = property?.images || [];
  const imageSliceCreator = createImageStoreSlice(initialImages);

  return createStore<PropertyFormStore>()(
    persist(
      (set, get, api) => ({
        initialProperty: property,
        freshProperty: property,
        property: convertToMutableProperty(property),
        hydrated: false,
        resetKey: generateUUID(),
        ...imageSliceCreator(set, get, api),

        updateProperty: (updater: (draft: MutableProperty) => void) =>
          set(
            produce((state: PropertyFormStore) => {
              updater(state.property);
            }),
          ),

        reset: (property?: DBProperty) =>
          set((state) => {
            const newProperty = property ? property : state.initialProperty;
            return {
              ...state,
              ...imageSliceCreator(set, get, api),
              initialProperty: newProperty,
              property: convertToMutableProperty(newProperty),
              hydrated: state.hydrated,
              resetKey: generateUUID(), // Force component re-render
            };
          }),
      }),
      {
        name: `property-store-${store_id}`,
        partialize: (state) => ({
          initialProperty: state.initialProperty,
          property: state.property,
          resetKey: state.resetKey,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            console.log("hydrated, ", state);

            // Check if we need to reset due to property mismatch
            if (state.property.id !== state.freshProperty?.id) {
              console.log("property id mismatch, updating state");

              // Instead of calling reset (which could cause issues),
              // directly update the state
              const newProperty = state.freshProperty;

              Object.assign(state, {
                initialProperty: newProperty,
                property: convertToMutableProperty(newProperty),
                resetKey: generateUUID(),
              });
            }

            // Set hydrated to true after all operations
            state.hydrated = true;
            // Images are now managed by the slice, not persisted with property
          }
        },
      },
    ),
  );
}
