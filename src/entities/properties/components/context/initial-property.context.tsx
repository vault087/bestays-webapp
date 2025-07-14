"use client";

import { ReactNode, createContext, useContext, useMemo } from "react";
import { DictionaryEntry, Dictionary } from "@/entities/dictionaries/types/dictionary.types";
import { Property } from "@/entities/properties-sale-rent/types/property.type";

export type InitialPropertyContextType = {
  property: Property;
  dictionary: Dictionary;
  entries: DictionaryEntry[];
};

// Create context with proper type safety
export const InitialPropertyContext = createContext<InitialPropertyContextType | null>(null);

// Store Provider props
export interface InitialPropertyProviderProps {
  children: ReactNode;
  property: Property;
  dictionary: Dictionary;
  entries: DictionaryEntry[];
}

// Store Provider component
export const InitialPropertyProvider = ({ children, property, dictionary, entries }: InitialPropertyProviderProps) => {
  const contextValue = useMemo(() => {
    return {
      property,
      dictionary,
      entries,
    };
  }, [property, dictionary, entries]);

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
