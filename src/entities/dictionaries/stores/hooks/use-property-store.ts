"use client";

import { useContext, useMemo } from "react";
import { useStore } from "zustand";
import { usePropertyId } from "@/entities/dictionaries/contexts/hooks/use-property-id";
import { PropertyStoreContext } from "@cms/modules/properties/form/contexts/property-store.context";
import { PropertyStore, PropertyStoreActions } from "@cms/modules/properties/form/stores/property.store";
import { FormProperty } from "@cms/modules/properties/form/types";

// Returns getState() with non-reactive actions
export const usePropertyStoreActions = (): PropertyStoreActions => {
  const storeContext = useContext(PropertyStoreContext);

  if (storeContext === null) {
    throw new Error("usePropertyStore must be used within PropertyStoreProvider");
  }

  return storeContext.getState();
};

// Returns a reactive selector for the Property Store
export const usePropertyStore = <T>(selector: (store: PropertyStore) => T): T => {
  const storeContext = useContext(PropertyStoreContext);

  if (storeContext === null) {
    throw new Error("useProperties must be used within PropertyStoreProvider");
  }

  return useStore(storeContext, selector);
};

// Returns a reactive selector for a specific FormProperty
export const useProperty = <T>(selector: (property: FormProperty) => T): T | undefined => {
  const propertyId = usePropertyId();
  return usePropertyStore((s) => {
    const property = s.properties[propertyId];
    return property ? selector(property) : undefined;
  });
};

// Returns a sorted list of property IDs
export function usePropertySorting(): string[] {
  const sorting = usePropertyStore((s) => s.sorting);

  return useMemo(() => {
    return Object.keys(sorting).sort((a, b) => sorting[a] - sorting[b]);
  }, [sorting]);
}
