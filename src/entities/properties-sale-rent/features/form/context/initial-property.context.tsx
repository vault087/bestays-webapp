"use client";

import { ReactNode, createContext, useContext, useMemo } from "react";
import { MutableProperty } from "@/entities/properties-sale-rent/";

export type InitialPropertyContextType = {
  initialProperty: MutableProperty;
  updateProperty: (updater: (draft: MutableProperty) => void) => void;
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

export function usePropertyFormStaticStore(): InitialPropertyContextType {
  const context = useContext(InitialPropertyContext);
  if (!context) {
    throw new Error("usePropertyFormStaticStore must be used within a InitialPropertyProvider");
  }
  return context;
}
