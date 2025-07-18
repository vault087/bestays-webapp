"use client";
import { memo, useCallback, useMemo } from "react";
import { DebugCard } from "@/components/ui/debug-json-card";
import { createDictionaryStore } from "@/entities/dictionaries/stores/-dictionary.store";
import { DictionaryStoreProvider } from "@/entities/dictionaries/stores/contexts/dictionary-store.context";
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
  PropertyAboutInput,
  PropertyAgentNotesInput,
  PropertyAreaInput,
  PropertyDivisibleSaleInput,
  PropertyOwnershipTypeInput,
  PropertyPropertyTypeInput,
  PropertyHighlightsCheckbox,
  PropertyLocationStrengthsCheckbox,
  PropertyTransactionTypesCheckbox,
  PropertyLandFeaturesCheckbox,
  PropertyNearbyAttractionsCheckbox,
  PropertyImagesInput,
  PropertyLandAndConstructionCheckbox,
  PropertyPriceInput,
  PropertySizeInput,
  InitialPropertyProvider,
} from "@/entities/properties-sale-rent/";
import { PropertyRoomsInput } from "@/entities/properties-sale-rent/features/edit/components/ui/property-rooms-input";

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
  const dictionaryStore = useMemo(() => createDictionaryStore(dictionaries, entries), [dictionaries, entries]);

  return (
    <DictionaryStoreProvider store={dictionaryStore}>
      <PropertyStoreProvider store={propertyStore}>
        <PropertyStoreHydrated fallback={<div>Loading...</div>}>
          <PropertyListCanvas />
        </PropertyStoreHydrated>
      </PropertyStoreProvider>
    </DictionaryStoreProvider>
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
        <div className="grid-cols grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {properties.slice(0, 1).map((property) => (
            <InitialPropertyProvider
              initialProperty={property}
              updateProperty={(updater) => handleUpdateProperty(property.id, updater)}
              key={property.id}
            >
              {/* <PropertyLocaleProvider locale={locale}> */}
              <PropertyImagesInput />
              <PropertySizeInput />
              <PropertyRoomsInput />
              <PropertyPriceInput />
              <PropertyAboutInput />
              <PropertyAgentNotesInput />
              <PropertyAreaInput />
              <PropertyHighlightsCheckbox />
              <PropertyDivisibleSaleInput />
              <PropertyOwnershipTypeInput />
              <PropertyPropertyTypeInput />
              <PropertyLocationStrengthsCheckbox />
              <PropertyTransactionTypesCheckbox />
              <PropertyLandFeaturesCheckbox />
              <PropertyNearbyAttractionsCheckbox />
              <PropertyLandAndConstructionCheckbox />
              {/* </PropertyLocaleProvider> */}
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
