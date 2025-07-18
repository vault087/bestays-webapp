"use client";

import { useMemo } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { useDictionaryStoreContext } from "@/entities/dictionaries/stores/contexts/dictionary-store.context";
import { MutableDictionary, MutableEntry } from "@/entities/dictionaries/types/dictionary.types";

export type PropertyDictionariesData = {
  dictionariesByCode: Record<string, MutableDictionary>;
  entriesByDictionaryCode: Record<string, MutableEntry[]>;
};

// Initially keep the original name for backward compatibility
export function useDictionaryContext(): PropertyDictionariesData {
  const store = useDictionaryStoreContext();

  const dictionaries = useStore(
    store,
    useShallow((state) => Object.values(state.dictionaries)),
  );

  const entries = useStore(
    store,
    useShallow((state) => Object.values(state.entries)),
  );

  return useMemo(() => {
    const dictionariesArray = dictionaries as MutableDictionary[];
    const entriesArray = entries as MutableEntry[];

    const dictionariesByCode = dictionariesArray.reduce(
      (acc, dictionary) => {
        if (dictionary.code) {
          acc[dictionary.code] = dictionary;
        }
        return acc;
      },
      {} as Record<string, MutableDictionary>,
    );

    const dictionariesByID = dictionariesArray.reduce(
      (acc, dictionary) => {
        if (dictionary.id) {
          acc[dictionary.id] = dictionary;
        }
        return acc;
      },
      {} as Record<string, MutableDictionary>,
    );

    const entriesByDictionaryCode = entriesArray.reduce(
      (acc, entry) => {
        const dictionary = dictionariesByID[entry.dictionary_id];
        if (dictionary?.code) {
          acc[dictionary.code] = [...(acc[dictionary.code] || []), entry];
        }
        return acc;
      },
      {} as Record<string, MutableEntry[]>,
    );

    return {
      dictionariesByCode,
      entriesByDictionaryCode,
    };
  }, [dictionaries, entries]);
}

// Later, when ready to rename:
// export function usePropertyDictionaries(): PropertyDictionariesData {
//   // Same implementation as above
// }
