"use client";

import { ReactNode, createContext, useContext, useMemo } from "react";
import { Property } from "@/entities/properties-sale-rent/core/types/property.types";

export type InitialPropertyContextType = {
  initialProperty: Property;
  updateProperty: (updater: (draft: Property) => void) => void;
};

// Create context with proper type safety
export const InitialPropertyContext = createContext<InitialPropertyContextType | null>(null);

// Store Provider props
export type InitialPropertyProviderProps = {
  children: ReactNode;
} & InitialPropertyContextType;

// Store Provider component
export const InitialPropertyProvider = ({
  children,
  initialProperty,
  updateProperty,
}: InitialPropertyProviderProps) => {
  const contextValue = useMemo(() => {
    return {
      initialProperty,
      updateProperty,
    };
  }, [initialProperty, updateProperty]);

  return <InitialPropertyContext.Provider value={contextValue}>{children}</InitialPropertyContext.Provider>;
};

// Context hook
export function useInitialPropertyContext(): InitialPropertyContextType {
  const context = useContext(InitialPropertyContext);
  if (!context) {
    throw new Error("useInitialPropertyContext must be used within a InitialPropertyProvider");
  }
  return context;
}
