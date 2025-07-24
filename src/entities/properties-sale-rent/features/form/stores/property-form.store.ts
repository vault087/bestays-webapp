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
  dbProperty?: DBProperty | undefined;
  property: MutableProperty;
  hydrated: boolean;
  resetKey: string;
}

// MutableDictionary Store Actions
export interface PropertyFormStoreActions extends ImageStoreSliceActions {
  updateProperty: (updater: (draft: MutableProperty) => void) => void;
  reset: () => void;
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
        dbProperty: property,
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
            const newProperty = property ? property : state.dbProperty;
            return {
              ...state,
              ...imageSliceCreator(set, get, api),
              dbProperty: newProperty,
              property: convertToMutableProperty(newProperty),
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
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            // Images are now managed by the slice, not persisted with property
            state.hydrated = true;
          }
        },
      },
    ),
  );
}
