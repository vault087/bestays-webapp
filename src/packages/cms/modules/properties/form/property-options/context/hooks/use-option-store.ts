import { useContext, useMemo } from "react";
import { useStore } from "zustand";
import { OptionStoreContext, OptionStore, OptionStoreActions } from "@cms/modules/properties/form/property-options";
import { PropertyOption } from "@cms/modules/properties/property.types";
import { useOptionId } from "./use-option-id";

// Returns getState() with non-reactive actions
export const useOptionStoreActions = (): OptionStoreActions => {
  const storeContext = useContext(OptionStoreContext);

  if (storeContext === null) {
    throw new Error("usePropertyStore must be used within PropertyStoreProvider");
  }

  return storeContext.getState();
};

// Returns a reactive selector for the Property Store
export const useOptionStore = <T>(selector: (store: OptionStore) => T): T => {
  const storeContext = useContext(OptionStoreContext);

  if (storeContext === null) {
    throw new Error("useProperties must be used within PropertyStoreProvider");
  }

  return useStore(storeContext, selector);
};

// Returns a reactive selector for a specific FormProperty
export const useOption = <T>(selector: (option: PropertyOption) => T): T | undefined => {
  const { propertyId, optionId } = useOptionId();
  return useOptionStore((s) => {
    const option = s.options[propertyId]?.[optionId];
    return option ? selector(option) : undefined;
  });
};

const EMPTY_OPTIONS = {};

// Returns a sorted list of property IDs
export function useOptionSorting(): string[] {
  const { propertyId } = useOptionId();
  const optionsObj = useOptionStore((s) => s.options[propertyId] || EMPTY_OPTIONS);

  return useMemo(() => {
    return Object.keys(optionsObj).sort(
      (a, b) => (optionsObj[a].display_order || 0) - (optionsObj[b].display_order || 0),
    );
  }, [optionsObj]);
}
