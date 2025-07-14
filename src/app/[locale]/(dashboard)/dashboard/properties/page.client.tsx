"use client";
import { useMemo } from "react";
import { DebugCard } from "@/components/ui/debug-json-card";
import { createDictionaryStore } from "@/entities/dictionaries/stores/dictionary.store";
import { Dictionary, DictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";
import { MultiOptionCheckbox } from "@/entities/properties/components/ui/multi-option-checkbox";
import { usePropertyStore } from "@/entities/properties-sale-rent/stores/hooks";
import { createPropertyStore } from "@/entities/properties-sale-rent/stores/property.store";
import { Property } from "@/entities/properties-sale-rent/types";

export default function PropertiesPageClient({
  properties,
  dictionaries,
  entries,
}: {
  properties: Property[];
  dictionaries: Dictionary[];
  entries: DictionaryEntry[];
}) {
  console.log(properties);

  const convertToDictionaryStore = (dictionaries: Dictionary[], entries: DictionaryEntry[]) => {
    return dictionaries.reduce(
      (acc, dictionary) => {
        acc[dictionary.id] = {
          ...dictionary,
          is_new: false,
        };
        return acc;
      },
      {} as Record<string, Dictionary>,
    );
  };

  const convertToDictionaryEntriesStore = (entries: DictionaryEntry[]) => {
    return entries.reduce(
      (acc, entry) => {
        acc[entry.id] = {
          ...entry,
          is_new: false,
        };
        return acc;
      },
      {} as Record<string, DictionaryEntry>,
    );
  };
  const convertToPropertyStore = (properties: Property[]) => {
    return properties.reduce(
      (acc, property) => {
        acc[property.id] = {
          ...property,
          is_new: false,
        };
        return acc;
      },
      {} as Record<string, Property>,
    );
  };

  const propertyStore = useMemo(
    () => createPropertyStore("properties-sell-rent", convertToPropertyStore(properties)),
    [properties],
  );
  const dictionaryStore = useMemo(
    () =>
      createDictionaryStore(convertToDictionaryStore(dictionaries, entries), convertToDictionaryEntriesStore(entries)),
    [dictionaries, entries],
  );

  // prepare dictionaries and entries for the store and context

  const highlightsDictionary = dictionaries.find((dict) => dict.code === "highlights");
  const highlightsEntries = entries.filter((entry) => entry.dictionary_id === highlightsDictionary?.id);
  console.log("highlightsEntries", highlightsEntries);

  return (
    <div className="flex flex-col gap-4 p-4">
      <p>Properties</p>
      <div className="flex flex-row gap-4">
        <div className="grid grid-cols-2 gap-4">
          {properties.map((property) => (
            <MultiOptionCheckbox
              key={property.id}
              inputId="multi-option-checkbox"
              initialValues={[]}
              setValue={() => {}}
              options={highlightsEntries}
              dictionary={{
                code: "property_type",
                name: { en: "Highlights" },
                description: { en: "Please select the highlights for the property" },
                id: 1,
                is_new: false,
              }}
              locale="en"
            />
          ))}
        </div>
        <ReactiveDebugCard />
      </div>
    </div>
  );
}

function ReactiveDebugCard() {
  // ✅ FIXED: Single subscription instead of multiple to prevent infinite loops
  const properties = usePropertyStore((state) => state.properties);

  return <DebugCard label="Error State Debug" json={{ properties }} />;
}
