"use client";

import { useContext } from "react";
import { useDebouncedCallback } from "use-debounce";
import { StoreApi, useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { PropertyFormStore, PropertyFormStoreActions } from "./property-form.store";
import { PropertyFormStoreContext } from "./property-form.store.provider";

export function usePropertyFormStoreContext(): StoreApi<PropertyFormStore> {
  const context = useContext(PropertyFormStoreContext);
  if (!context) {
    throw new Error("useStoreContext must be used within a StoreProvider");
  }
  return context;
}

export function usePropertyFormStore<T>(selector: (state: PropertyFormStore) => T): T {
  const store = usePropertyFormStoreContext();
  return useStore(store, useShallow(selector));
}

export function usePropertyFormStaticStore(): PropertyFormStore {
  const store = usePropertyFormStoreContext();
  return store.getState();
}

export function usePropertyFormStoreActions(): PropertyFormStoreActions {
  const store = usePropertyFormStoreContext();
  return {
    updateProperty: useDebouncedCallback(store.getState().updateProperty, 300),
    reset: store.getState().reset,
  };
}
