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
  PropertyAgentNotesInput,
  PropertyAreaInput,
  PropertyDivisibleSaleInput,
  PropertyOwnershipTypeInput,
  PropertyPropertyTypeInput,
  PropertyHighlightsInput,
  PropertyLocationStrengthsInput,
  PropertyTransactionTypesInput,
  PropertyLandFeaturesInput,
  PropertyNearbyAttractionsInput,
  PropertyLandAndConstructionInput,
  PropertySizeInput,
  PropertyRoomsInputGroup,
  usePropertyFormStore,
  createPropertyFormStore,
  PropertyPriceInputGroup,
} from "@/entities/properties-sale-rent/";
import { PropertyImagesInput } from "@/entities/properties-sale-rent/features/form/components/images-input";
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
    <div className="bg-accent flex flex-row gap-4 p-4">
      <div className="bg-background flex w-full flex-col rounded-md p-4">
        <p>Properties</p>
        <div className="flex flex-row gap-8 pt-4">
          {/* Fields Container */}
          <div className="flex flex-1 flex-col space-y-8">
            <PropertyImagesInput />

            <div className="grid grid-cols-1 items-center gap-4">
              <PropertySizeInput />
              <PropertyRoomsInputGroup />
            </div>
            <div className="flex w-1/2 flex-row items-start gap-4">
              <PropertyPriceInputGroup direction="vertical" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <PropertyHighlightsInput />
              <PropertyLocationStrengthsInput />
              <PropertyTransactionTypesInput />
              <PropertyLandFeaturesInput />
              <PropertyNearbyAttractionsInput />
              <PropertyLandAndConstructionInput />
            </div>

            <div className="flex w-full flex-row space-x-4">
              <PropertyAboutInput />
              <PropertyAgentNotesInput />
            </div>

            <div className="grid grid-cols-2 items-center gap-4">
              <PropertyAreaInput />
              <PropertyDivisibleSaleInput />
              <PropertyOwnershipTypeInput />
              <PropertyPropertyTypeInput />
            </div>
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
