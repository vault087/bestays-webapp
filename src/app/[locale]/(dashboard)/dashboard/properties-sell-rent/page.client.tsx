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
  PropertyLandFeaturesInput,
  PropertyNearbyAttractionsInput,
  PropertyLandAndConstructionInput,
  PropertySizeInput,
  PropertyRoomsInputGroup,
  usePropertyFormStore,
  createPropertyFormStore,
  // PropertyPriceInputGroup,
} from "@/entities/properties-sale-rent/";
import { PropertyImagesInput } from "@/entities/properties-sale-rent/features/form/components/images-input";
import { PropertyAboutInput } from "@/entities/properties-sale-rent/features/form/components/localized-text-input";
import { cn } from "@/modules/shadcn";
import Comp439 from "@/modules/shadcn/components/comp-439";
import Comp520 from "@/modules/shadcn/components/comp-520";
import Comp521 from "@/modules/shadcn/components/comp-521";

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
    <div className="flex h-full w-full">
      <DictionaryFormStoreProvider store={dictionaryStore}>
        <PropertyFormStoreProvider store={propertyStore}>
          <PropertyFormStoreHydrated fallback={<div>Loading...</div>}>
            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-1 overflow-auto">
                <PropertyListCanvas />
              </div>
            </div>
          </PropertyFormStoreHydrated>
        </PropertyFormStoreProvider>
      </DictionaryFormStoreProvider>
    </div>
  );
}

const PropertyListCanvas = memo(function PropertyListCanvas({ className }: { className?: string }) {
  return (
    <div className={cn("bg-background w-full px-5 pt-5", className)}>
      {/* Editing Area */}
      {/* <div className="w-full"> */}
      {/* Fields Container */}
      <div className="rounded-card flex flex-row items-start justify-center gap-4 rounded-md p-0">
        {/* Left Column */}
        <div className="flex flex-1 flex-col space-y-4 pb-8">
          <PropertyAreaInput />
          <PropertyPropertyTypeInput />

          {/* <div className="flex w-1/2 flex-col items-start gap-4">
              <PropertyPriceInputGroup direction="vertical" />
            </div> */}

          <div className="grid grid-cols-1 gap-4">
            <PropertyHighlightsInput />
            <PropertyLocationStrengthsInput />
            <PropertyNearbyAttractionsInput />
          </div>

          {/* <div className="flex w-full flex-col space-y-4">
              <PropertyAboutInput />
            </div> */}
          <PropertyRoomsInputGroup />

          <div className="flex w-full flex-col items-center gap-4 pt-4">
            <PropertySizeInput />
            <PropertyOwnershipTypeInput />
            <PropertyDivisibleSaleInput />
            <PropertyLandAndConstructionInput />
            <PropertyLandFeaturesInput />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-1 flex-col space-y-4">
          <PropertyImagesInput />
          {/* <PropertyAboutInput /> */}
          <PropertyAgentNotesInput />
        </div>
      </div>
      {/* </div> */}
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
