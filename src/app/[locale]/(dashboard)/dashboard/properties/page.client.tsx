"use client";
import { useLocale } from "next-intl";
import { useMemo } from "react";
import { DebugCard } from "@/components/ui/debug-json-card";
import { Dictionary, DictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";
import { DictionaryProvider } from "@/entities/properties/components/context/dictionary.context";
import { InitialPropertyProvider } from "@/entities/properties/components/context/initial-property.context";
import {
  PropertyAreaUncontrolledInput,
  PropertyDivisibleSaleUncontrolledInput,
  PropertyOwnershipTypeUncontrolledInput,
  PropertyPropertyTypeUncontrolledInput,
  PropertyHighlightsUncontrolledInput,
  PropertyHighlightsUncontrolledCheckbox,
  PropertyLocationStrengthsUncontrolledCheckbox,
  PropertyTransactionTypesUncontrolledCheckbox,
  PropertyLandFeaturesUncontrolledCheckbox,
  PropertyNearbyAttractionsUncontrolledCheckbox,
  PropertyLandAndConstructionUncontrolledCheckbox,
} from "@/entities/properties/components/ui";
import {
  createPropertyStore,
  convertToPropertyStore,
  PropertyStoreProvider,
} from "@/entities/properties-sale-rent/stores";
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
  const propertyStore = useMemo(
    () => createPropertyStore("properties-sell-rent", convertToPropertyStore(properties)),
    [properties],
  );

  const locale = useLocale();
  return (
    <PropertyStoreProvider store={propertyStore}>
      <DictionaryProvider dictionaries={dictionaries} entries={entries}>
        <div className="flex flex-col gap-4 p-4">
          <p>Properties</p>
          <div className="flex flex-row gap-4">
            <div className="flex flex-row flex-wrap gap-4">
              {properties.slice(0, 1).map((property) => (
                <InitialPropertyProvider initialProperty={property} updateProperty={() => {}} key={property.id}>
                  <PropertyAreaUncontrolledInput locale={locale} />
                  <PropertyHighlightsUncontrolledInput locale={locale} />
                  <PropertyHighlightsUncontrolledCheckbox locale={locale} />
                  <PropertyDivisibleSaleUncontrolledInput locale={locale} />
                  <PropertyOwnershipTypeUncontrolledInput locale={locale} />
                  <PropertyPropertyTypeUncontrolledInput locale={locale} />
                  <PropertyLocationStrengthsUncontrolledCheckbox locale={locale} />
                  <PropertyTransactionTypesUncontrolledCheckbox locale={locale} />
                  <PropertyLandFeaturesUncontrolledCheckbox locale={locale} />
                  <PropertyNearbyAttractionsUncontrolledCheckbox locale={locale} />
                  <PropertyLandAndConstructionUncontrolledCheckbox locale={locale} />
                </InitialPropertyProvider>
              ))}
            </div>
            {/* <ReactiveDebugCard /> */}
          </div>
        </div>
      </DictionaryProvider>
    </PropertyStoreProvider>
  );
}

function PropertyListCanvas() {
  return <div>PropertyListCanvas</div>;
}

function ReactiveDebugCard() {
  // ✅ FIXED: Single subscription instead of multiple to prevent infinite loops
  const properties = usePropertyStore((state) => state.properties);

  return <DebugCard label="Error State Debug" json={{ properties }} />;
}
