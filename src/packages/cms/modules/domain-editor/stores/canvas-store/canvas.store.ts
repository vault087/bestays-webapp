"use client";

export * from "./canvas.store.hooks";
export * from "./canvas.store.context";

import { create, StoreApi } from "zustand";
import { persist } from "zustand/middleware";
import { generateUUID } from "@shared-ui/lib/utils";
import { createPropertyStore, PropertyStore } from "@cms/modules/properties/form/stores/property.store";
import { FormProperty } from "@cms/modules/properties/form/types";
import { Property, PropertyOption } from "@cms/modules/properties/property.types";
/**
 * 🔄 Hydration state tracking
 */
export type CanvasStoreHydration = {
  hasHydrated: boolean;
};

/**
 * 📊 Core property data state
 */
export type CanvasStoreState = {
  domainId: string;
  dbProperties: Property[];

  resetKey: string; // Force component re-render on reset
  hasDataConflict: boolean; // Track if DB data changed while editing
  conflictData: Property[] | null; // The newer DB data causing conflict
};

/**
 * ⚙️ Property CRUD operations
 */
export type CanvasStoreActions = {
  reset: () => void;
  setup: (properties: Property[]) => void;
  detectConflict: (newDbProperties: Property[]) => void;
  resolveConflict: (action: "refresh" | "cancel") => void;
};

export type CanvasStore = CanvasStoreHydration & CanvasStoreState & CanvasStoreActions & PropertyStore;

export function createCanvasStore(
  domainId: string,
  currentLocale: string,
  initialProperties: Property[],
): StoreApi<CanvasStore> {
  /**
   * 🔧 Helper: Transform server properties to store format
   */
  const buildInitialState = (
    properties: Property[],
  ): Pick<
    CanvasStore,
    | "dbProperties"
    | "properties"
    | "options"
    | "sorting"
    | "deletedPropertyIds"
    | "deletedOptionIds"
    | "hasChanged"
    | "resetKey"
    | "hasDataConflict"
    | "conflictData"
  > => {
    const state = {
      dbProperties: properties,
      properties: {} as Record<string, FormProperty>,
      options: {} as Record<string, Record<string, PropertyOption>>,
      sorting: {} as Record<string, number>,
      deletedPropertyIds: [] as string[],
      deletedOptionIds: [] as string[],
      hasChanged: false,
      resetKey: generateUUID(),
      hasDataConflict: false,
      conflictData: null,
    };

    // Map properties to the state
    (properties ?? []).forEach((property, index) => {
      const { display_order, options, ...propertyWithoutDisplayOrder } = property;

      // Convert Property to FormProperty format by adding is_new flag
      const formProperty: FormProperty = {
        ...propertyWithoutDisplayOrder,
        is_new: property.is_new || false, // Ensure is_new exists
      };

      state.sorting[property.id] = display_order || index;
      state.properties[property.id] = formProperty;

      // Initialize options for this property (even if empty)
      state.options[property.id] = {};
      if (options?.length) {
        state.options[property.id] = Object.fromEntries(options.map((option) => [option.option_id, option]));
      }
    });
    return state;
  };

  return create<CanvasStore>()(
    persist(
      (set, get, api) => ({
        hasHydrated: false,
        domainId: domainId,
        ...createPropertyStore(set, get, api),
        ...buildInitialState(initialProperties),

        /**
         * 🔄 Reset to original server state
         */
        reset: () =>
          set((state) => {
            return {
              ...state,
              ...buildInitialState(state.dbProperties),
              domainId: state.domainId,
              hasHydrated: state.hasHydrated,
              resetKey: generateUUID(), // Force component re-render
            };
          }),

        setup: (properties: Property[]) =>
          set((state) => {
            return {
              ...state,
              ...buildInitialState(properties),
              domainId: state.domainId,
              hasHydrated: state.hasHydrated,
            };
          }),

        /**
         * 🔍 Detect data conflicts between current and new DB properties
         */
        detectConflict: (newDbProperties: Property[]) =>
          set((state) => {
            const currentDbProperties = state.dbProperties;

            // If no current DB properties in store, this is initial load - proceed normally
            if (currentDbProperties.length === 0) {
              return {
                ...state,
                ...buildInitialState(newDbProperties),
                domainId: state.domainId,
                hasHydrated: state.hasHydrated,
              };
            }

            // Compare current DB properties with new DB properties
            const currentJson = JSON.stringify(currentDbProperties);
            const newJson = JSON.stringify(newDbProperties);
            const dbDataChanged = currentJson !== newJson;

            if (dbDataChanged) {
              // DB data has changed - check if user has unsaved edits
              if (state.hasChanged) {
                // User has unsaved changes - show conflict dialog
                return {
                  ...state,
                  hasDataConflict: true,
                  conflictData: newDbProperties,
                };
              } else {
                // No unsaved changes - automatically update to new data
                return {
                  ...state,
                  ...buildInitialState(newDbProperties),
                  domainId: state.domainId,
                  hasHydrated: state.hasHydrated,
                };
              }
            }

            // No DB changes - just update dbProperties reference, keep all form state
            return {
              ...state,
              dbProperties: newDbProperties,
            };
          }),

        /**
         * 🔧 Resolve data conflict based on user choice
         */
        resolveConflict: (action: "refresh" | "cancel") =>
          set((state) => {
            if (action === "refresh" && state.conflictData) {
              // Accept new data, reset all changes
              const newState = {
                ...state,
                ...buildInitialState(state.conflictData),
                domainId: state.domainId,
                hasHydrated: state.hasHydrated,
                hasDataConflict: false,
                conflictData: null,
              };

              return newState;
            }

            // Cancel - just clear conflict state, keep working with current data
            return {
              ...state,
              hasDataConflict: false,
              conflictData: null,
            };
          }),
      }),
      {
        name: `property-store-${domainId}`,
        partialize: (state) => ({
          domainId: state.domainId,
          properties: state.properties,
          options: state.options,
          sorting: state.sorting,
          deletedOptionIds: state.deletedOptionIds,
          hasChanged: state.hasChanged,
          resetKey: state.resetKey,
          dbProperties: state.dbProperties,
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

export type CanvasStoreReturnType = ReturnType<typeof createCanvasStore>;
