"use client";

import { ReactNode, createContext } from "react";
import { StoreApi } from "zustand";
import { PropertyFormStore } from "./property-form.store";
import { usePropertyFormStore } from "./property-form.store.hooks";

// Create context with proper type safety
export const PropertyFormStoreContext = createContext<StoreApi<PropertyFormStore> | null>(null);

// Store Provider component
export const PropertyFormStoreProvider = ({
  children,
  store,
}: {
  children: ReactNode;
  store: StoreApi<PropertyFormStore>;
}) => {
  return <PropertyFormStoreContext.Provider value={store}>{children}</PropertyFormStoreContext.Provider>;
};

export function PropertyFormStoreHydrated({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const hydrated = usePropertyFormStore((state) => state.hydrated);

  if (!hydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
