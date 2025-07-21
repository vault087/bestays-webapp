"use client";
import { memo, useMemo } from "react";
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
  PropertyAreaInput,
  PropertyDivisibleSaleInput,
  PropertyOwnershipTypeInput,
  PropertyPropertyTypeInput,
  // PropertyHighlightsCheckbox,
  // PropertyLocationStrengthsCheckbox,
  // PropertyTransactionTypesCheckbox,
  // PropertyLandFeaturesCheckbox,
  // PropertyNearbyAttractionsCheckbox,
  // PropertyImagesInput,
  // PropertyLandAndConstructionCheckbox,
  // PropertyPriceInputGroup,
  // PropertySizeInput,
  usePropertyFormStore,
  createPropertyFormStore,
  PropertyPriceInputGroup,
} from "@/entities/properties-sale-rent/";
// import { PropertyRoomsInput } from "@/entities/properties-sale-rent/features/form/components/rooms-input";
import { PropertyAboutInput } from "@/entities/properties-sale-rent/features/form/components/localized-text-input";

export default function PropertiesPageClient({
  properties,
  dictionaries,
  entries,
}: {
  properties: MutableProperty[];
  dictionaries: DBDictionary[];
  entries: DBDictionaryEntry[];
}) {
  const dictionaryStore = useMemo(() => createDictionaryFormStore(dictionaries, entries), [dictionaries, entries]);
  const propertyStore = useMemo(() => createPropertyFormStore("properties-sell-rent", properties[0]), [properties]);

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
  return (
    <div className="bg-accent flex flex-col gap-4 p-4">
      <div className="bg-background flex flex-col gap-4 rounded-md p-4">
        <p>Properties</p>
        <div className="flex flex-row gap-4">
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-row items-start gap-4">
              <PropertyPriceInputGroup className="flex flex-col" />

              <div className="flex w-full flex-col">
                <PropertyAboutInput />
                <PropertyAgentNotesInput />
              </div>
            </div>

            <div className="flex flex-row items-center gap-4">
              <div className="flex flex-1 flex-col gap-4">
                <PropertyAreaInput />
                <PropertyDivisibleSaleInput />
              </div>
              <div className="flex flex-1 flex-col gap-4">
                <PropertyOwnershipTypeInput />
                <PropertyPropertyTypeInput />
              </div>
            </div>
            {/* <PropertyHighlightsCheckbox /> */}
            {/* <PropertyLocaleProvider locale={locale}> */}
            {/* <PropertyImagesInput />
              <PropertySizeInput />
              <PropertyRoomsInput />
              <PropertyAreaInput />
              <PropertyLocationStrengthsCheckbox />
              <PropertyTransactionTypesCheckbox />
              <PropertyLandFeaturesCheckbox />
              <PropertyNearbyAttractionsCheckbox />
              <PropertyLandAndConstructionCheckbox /> */}
            {/* </PropertyLocaleProvider> */}
            {/* </InitialPropertyProvider> */}
          </div>
        </div>
      </div>
      {/* <ReactiveDebugCard /> */}
    </div>
  );
});

export function ReactiveDebugCard() {
  // ✅ FIXED: Single subscription instead of multiple to prevent infinite loops
  const property = usePropertyFormStore((state) => state.property);
  const debug = useMemo(() => {
    return {
      property,
    };
  }, [property]);
  return <DebugCard label="Error State Debug" json={debug} />;
}
