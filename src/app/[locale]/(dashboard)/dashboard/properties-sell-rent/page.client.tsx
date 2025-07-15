"use client";
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
  Property,
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
  DictionaryProvider,
  InitialPropertyProvider,
  PropertyLocaleProvider,
} from "@/entities/properties-sale-rent/";

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
              <PropertyLocaleProvider locale={"en"}>
                <PropertyTitleUncontrolledInput />
                <PropertyDescriptionUncontrolledInput />
                <PropertyNotesUncontrolledInput />
                <PropertyAdditionalInfoUncontrolledInput />
                <PropertyAreaUncontrolledInput />
                <PropertyHighlightsUncontrolledInput />
                <PropertyHighlightsUncontrolledCheckbox />
                <PropertyDivisibleSaleUncontrolledInput />
                <PropertyOwnershipTypeUncontrolledInput />
                <PropertyPropertyTypeUncontrolledInput />
                <PropertyLocationStrengthsUncontrolledCheckbox />
                <PropertyTransactionTypesUncontrolledCheckbox />
                <PropertyLandFeaturesUncontrolledCheckbox />
                <PropertyNearbyAttractionsUncontrolledCheckbox />
                <PropertyLandAndConstructionUncontrolledCheckbox />
              </PropertyLocaleProvider>
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
