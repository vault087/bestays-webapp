"use client";

import { ReactNode, createContext, useContext, useMemo } from "react";
import { DictionaryEntry, Dictionary } from "@/entities/dictionaries/types/dictionary.types";

export type DictionaryContextType = {
  dictionariesByCode: Record<string, Dictionary>;
  entriesByDictionaryCode: Record<string, DictionaryEntry[]>;
};

// Create context with proper type safety
export const DictionaryContext = createContext<DictionaryContextType | null>(null);

// Store Provider props
export interface DictionaryProviderProps {
  children: ReactNode;
  dictionaries: Dictionary[];
  entries: DictionaryEntry[];
}

// Store Provider component
export const DictionaryProvider = ({ children, dictionaries, entries }: DictionaryProviderProps) => {
  const contextValue = useMemo(() => {
    const dictionariesByCode = dictionaries.reduce(
      (acc, dictionary) => {
        if (dictionary.code) {
          acc[dictionary.code] = dictionary;
        }
        return acc;
      },
      {} as Record<string, Dictionary>,
    );

    const dictionariesByID = dictionaries.reduce(
      (acc, dictionary) => {
        if (dictionary.id) {
          acc[dictionary.id] = dictionary;
        }
        return acc;
      },
      {} as Record<string, Dictionary>,
    );

    const entriesByDictionaryCode = entries.reduce(
      (acc, entry) => {
        const dictionary = dictionariesByID[entry.dictionary_id];
        if (dictionary?.code && entry.code) {
          acc[dictionary.code] = [...(acc[dictionary.code] || []), entry];
        }
        return acc;
      },
      {} as Record<string, DictionaryEntry[]>,
    );

    return {
      dictionariesByCode,
      entriesByDictionaryCode,
    };
  }, [dictionaries, entries]);

  return <DictionaryContext.Provider value={contextValue}>{children}</DictionaryContext.Provider>;
};

// Context hook
export function useDictionaryContext(): DictionaryContextType {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error("useDictionaryContext must be used within a DictionaryProvider");
  }
  return context;
}
