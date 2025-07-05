"use client";

import { ReactNode, createContext, useContext } from "react";
import { PropertyStoreApi } from "@/entities/properties-sale-rent/stores/property.store";

// Create context with proper type safety
export const PropertyStoreContext = createContext<PropertyStoreApi | null>(null);

// Store Provider props
export interface PropertyStoreProviderProps {
  children: ReactNode;
  store: PropertyStoreApi;
}

// Store Provider component
export const PropertyStoreProvider = ({ children, store }: PropertyStoreProviderProps) => {
  return <PropertyStoreContext.Provider value={store}>{children}</PropertyStoreContext.Provider>;
};

// Context hook
export function usePropertyStoreContext(): PropertyStoreApi {
  const context = useContext(PropertyStoreContext);
  if (!context) {
    throw new Error("usePropertyStoreContext must be used within a PropertyStoreProvider");
  }
  return context;
}
