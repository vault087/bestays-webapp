"use client";

import { ReactNode, createContext, useContext, useMemo } from "react";
import { DictionaryEntry, Dictionary } from "@/entities/dictionaries/types/dictionary.types";

export type DictionariesContextType = {
  dictionariesByCode: Record<string, Dictionary>;
  entriesByDictionaryCode: Record<string, DictionaryEntry[]>;
  dictionaryForPropertyField: (field: string) => Dictionary | undefined;
  entriesForPropertyField: (field: string) => DictionaryEntry[] | undefined;
};

// Create context with proper type safety
export const DictionariesContext = createContext<DictionariesContextType | null>(null);

// Store Provider props
export interface DictionariesProviderProps {
  children: ReactNode;
  dictionaries: Dictionary[];
  entries: DictionaryEntry[];
}

// Store Provider component
export const DictionariesProvider = ({ children, dictionaries, entries }: DictionariesProviderProps) => {
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

    const dictionaryForPropertyField = (field: string) => {
      return dictionariesByCode[field];
    };

    const entriesForPropertyField = (field: string) => {
      return entriesByDictionaryCode[field];
    };

    return {
      dictionariesByCode,
      entriesByDictionaryCode,
      dictionaryForPropertyField,
      entriesForPropertyField,
    };
  }, [dictionaries, entries]);

  return <DictionariesContext.Provider value={contextValue}>{children}</DictionariesContext.Provider>;
};

// Context hook
export function useDictionariesContext(): DictionariesContextType {
  const context = useContext(DictionariesContext);
  if (!context) {
    throw new Error("useDictionariesContext must be used within a DictionariesProvider");
  }
  return context;
}
