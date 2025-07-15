"use client";
import { useLocale } from "next-intl";
import { memo, useCallback, useMemo } from "react";
import { DebugCard } from "@/components/ui/debug-json-card";
import { Dictionary, DictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";
import {
  createPropertyStore,
  convertToPropertyStore,
  PropertyStoreProvider,
  PropertyStoreHydrated,
  usePropertyStore,
  useCurrentProperties,
  usePropertyActions,
} from "@/entities/properties-sale-rent/";
import {
  PropertyTitleUncontrolledInput,
  PropertyDescriptionUncontrolledInput,
  PropertyNotesUncontrolledInput,
  PropertyAdditionalInfoUncontrolledInput,
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
} from "@/entities/properties-sale-rent/features/edit/components";
import { DictionaryProvider } from "@/entities/properties-sale-rent/features/edit/components/context/dictionary.context";
import { InitialPropertyProvider } from "@/entities/properties-sale-rent/features/edit/components/context/initial-property.context";
import { Property } from "@/entities/properties-sale-rent/features/edit/types/property-field.types";

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

  return (
    <PropertyStoreProvider store={propertyStore}>
      <DictionaryProvider dictionaries={dictionaries} entries={entries}>
        <PropertyStoreHydrated fallback={<div>Loading...</div>}>
          <PropertyListCanvas />
        </PropertyStoreHydrated>
      </DictionaryProvider>
    </PropertyStoreProvider>
  );
}

const PropertyListCanvas = memo(function PropertyListCanvas() {
  const properties = useCurrentProperties();
  const locale = useLocale();

  const updateProperty = usePropertyActions().updateProperty;

  const handleUpdateProperty = useCallback(
    (id: string, updater: (draft: Property) => void) => {
      updateProperty(id, updater);
    },
    [updateProperty],
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <p>Properties</p>
      <div className="flex flex-row gap-4">
        <div className="flex flex-row flex-wrap gap-4">
          {properties.slice(0, 1).map((property) => (
            <InitialPropertyProvider
              initialProperty={property}
              updateProperty={(updater) => handleUpdateProperty(property.id, updater)}
              key={property.id}
            >
              <PropertyTitleUncontrolledInput locale={locale} />
              <PropertyDescriptionUncontrolledInput locale={locale} />
              <PropertyNotesUncontrolledInput locale={locale} />
              <PropertyAdditionalInfoUncontrolledInput locale={locale} />
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
        <ReactiveDebugCard />
      </div>
    </div>
  );
});

function ReactiveDebugCard() {
  // ✅ FIXED: Single subscription instead of multiple to prevent infinite loops
  const properties = usePropertyStore((state) => state.properties);
  const debug = useMemo(() => {
    return {
      property: Object.values(properties).slice(0, 1),
    };
  }, [properties]);
  return <DebugCard label="Error State Debug" json={debug} />;
}
