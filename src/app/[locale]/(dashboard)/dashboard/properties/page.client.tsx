"use client";
import { useLocale } from "next-intl";
import { DebugCard } from "@/components/ui/debug-json-card";
import { Dictionary, DictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";
import { DictionaryProvider } from "@/entities/properties/components/context/dictionary.context";
import { InitialPropertyProvider } from "@/entities/properties/components/context/initial-property.context";
import {
  PropertyHighlightsCheckbox,
  PropertyLocationStrengthsCheckbox,
  PropertyLandFeaturesCheckbox,
  PropertyNearbyAttractionsCheckbox,
  PropertyLandAndConstructionCheckbox,
  PropertyTransactionTypesCheckbox,
  PropertyAreaInput,
  PropertyDivisibleSaleInput,
  PropertyOwnershipTypeInput,
  PropertyPropertyTypeInput,
} from "@/entities/properties/components/ui";
import { usePropertyStore } from "@/entities/properties-sale-rent/stores/hooks";
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

  // const propertyStore = useMemo(
  //   () => createPropertyStore("properties-sell-rent", convertToPropertyStore(properties)),
  //   [properties],
  // );
  // const dictionaryStore = useMemo(
  //   () =>
  //     createDictionaryStore(convertToDictionaryStore(dictionaries, entries), convertToDictionaryEntriesStore(entries)),
  //   [dictionaries, entries],
  // );

  // prepare dictionaries and entries for the store and context

  const locale = useLocale();
  return (
    <DictionaryProvider dictionaries={dictionaries} entries={entries}>
      <div className="flex flex-col gap-4 p-4">
        <p>Properties</p>
        <div className="flex flex-row gap-4">
          <div className="flex flex-row flex-wrap gap-4">
            {properties.slice(0, 1).map((property) => (
              <InitialPropertyProvider initialProperty={property} updateProperty={() => {}} key={property.id}>
                <PropertyAreaInput locale={locale} />
                <PropertyDivisibleSaleInput locale={locale} />
                <PropertyOwnershipTypeInput locale={locale} />
                <PropertyPropertyTypeInput locale={locale} />
                <PropertyHighlightsCheckbox locale={locale} />
                <PropertyLocationStrengthsCheckbox locale={locale} />
                <PropertyTransactionTypesCheckbox locale={locale} />
                <PropertyLandFeaturesCheckbox locale={locale} />
                <PropertyNearbyAttractionsCheckbox locale={locale} />
                <PropertyLandAndConstructionCheckbox locale={locale} />
              </InitialPropertyProvider>
            ))}
          </div>
          {/* <ReactiveDebugCard /> */}
        </div>
      </div>
    </DictionaryProvider>
  );
}

function ReactiveDebugCard() {
  // ✅ FIXED: Single subscription instead of multiple to prevent infinite loops
  const properties = usePropertyStore((state) => state.properties);

  return <DebugCard label="Error State Debug" json={{ properties }} />;
}
