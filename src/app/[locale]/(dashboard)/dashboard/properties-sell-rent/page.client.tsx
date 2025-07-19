"use client";
import { memo, useCallback, useMemo } from "react";
import { DebugCard } from "@/components/ui/debug-json-card";
import { createDictionaryFormStore } from "@/entities/dictionaries/features/form/store";
import { DictionaryFormStoreProvider } from "@/entities/dictionaries/features/form/store/dictionary-form.store.provider";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";
import {
  PropertyFormStoreProvider,
  PropertyFormStoreHydrated,
  MutableProperty,
  // PropertyAboutInput,
  PropertyAgentNotesInput,
  // PropertyAreaInput,
  // PropertyDivisibleSaleInput,
  // PropertyOwnershipTypeInput,
  // PropertyPropertyTypeInput,
  // PropertyHighlightsCheckbox,
  // PropertyLocationStrengthsCheckbox,
  // PropertyTransactionTypesCheckbox,
  // PropertyLandFeaturesCheckbox,
  // PropertyNearbyAttractionsCheckbox,
  // PropertyImagesInput,
  // PropertyLandAndConstructionCheckbox,
  // PropertyPriceInput,
  // PropertySizeInput,
  usePropertyFormStore,
  createPropertyFormStore,
  usePropertyFormStaticStore,
} from "@/entities/properties-sale-rent/";
// import { PropertyRoomsInput } from "@/entities/properties-sale-rent/features/form/components/rooms-input";
import { InitialPropertyProvider } from "@/entities/properties-sale-rent/features/form/context/initial-property.context";

export default function PropertiesPageClient({
  properties,
  dictionaries,
  entries,
}: {
  properties: MutableProperty[];
  dictionaries: DBDictionary[];
  entries: DBDictionaryEntry[];
}) {
  const propertyStore = useMemo(() => createPropertyFormStore("properties-sell-rent", properties[0]), [properties]);
  const dictionaryStore = useMemo(() => createDictionaryFormStore(dictionaries, entries), [dictionaries, entries]);

  return (
    <DictionaryFormStoreProvider store={dictionaryStore}>
      <PropertyFormStoreProvider store={propertyStore}>
        <PropertyFormStoreHydrated fallback={<div>Loading...</div>}>
          <PropertyListCanvas />
        </PropertyFormStoreHydrated>
      </PropertyFormStoreProvider>
    </DictionaryFormStoreProvider>
  );
}

const PropertyListCanvas = memo(function PropertyListCanvas() {
  const property = usePropertyFormStore((state) => state.property);

  const { updateProperty } = usePropertyFormStaticStore();

  const handleUpdateProperty = useCallback(
    (updater: (draft: MutableProperty) => void) => {
      updateProperty(updater);
    },
    [updateProperty],
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <p>Properties</p>
      <div className="flex flex-row gap-4">
        <div className="grid-cols grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <InitialPropertyProvider initialProperty={property} updateProperty={handleUpdateProperty} key={property.id}>
            <PropertyAgentNotesInput />

            {/* <PropertyAreaInput /> */}
            {/* <PropertyHighlightsCheckbox /> */}
            {/* <PropertyDivisibleSaleInput /> */}
            {/* <PropertyOwnershipTypeInput /> */}
            {/* <PropertyPropertyTypeInput /> */}
            {/* <PropertyLocaleProvider locale={locale}> */}
            {/* <PropertyImagesInput />
              <PropertySizeInput />
              <PropertyRoomsInput />
              <PropertyPriceInput />
              <PropertyAboutInput />
              <PropertyAreaInput />
              <PropertyLocationStrengthsCheckbox />
              <PropertyTransactionTypesCheckbox />
              <PropertyLandFeaturesCheckbox />
              <PropertyNearbyAttractionsCheckbox />
              <PropertyLandAndConstructionCheckbox /> */}
            {/* </PropertyLocaleProvider> */}
          </InitialPropertyProvider>
        </div>
        <ReactiveDebugCard />
      </div>
    </div>
  );
});

function ReactiveDebugCard() {
  // ✅ FIXED: Single subscription instead of multiple to prevent infinite loops
  const property = usePropertyFormStore((state) => state.property);
  const debug = useMemo(() => {
    return {
      property,
    };
  }, [property]);
  return <DebugCard label="Error State Debug" json={debug} />;
}
