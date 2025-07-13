"use client";
import { Dictionary, DictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";
import { MultiOptionCheckbox } from "@/entities/properties/components/ui/multi-option-checkbox";
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

  const highlightsDictionary = dictionaries.find((dict) => dict.code === "highlights");
  const highlightsEntries = entries.filter((entry) => entry.dictionary_id === highlightsDictionary?.id);
  console.log(highlightsEntries);

  return (
    <div className="flex flex-col gap-4 p-4">
      <p>Properties</p>
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
    </div>
  );
}
