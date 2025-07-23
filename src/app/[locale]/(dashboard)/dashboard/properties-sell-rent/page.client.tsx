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
          <div className="flex w-full justify-center">
            <PropertyListCanvas />
          </div>
        </PropertyFormStoreHydrated>
      </PropertyFormStoreProvider>
    </DictionaryFormStoreProvider>
  );
}

const PropertyListCanvas = memo(function PropertyListCanvas({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full flex-row gap-4 bg-slate-900 px-4 pt-4", className)}>
      {/* Editing Area */}
      <div className="flex w-full flex-col gap-2 rounded-md">
        {/* Fields Container */}
        <div className="rounded-card bg-background flex flex-row items-start justify-center gap-4 rounded-md p-4">
          {/* Left Column */}
          <div className="flex flex-1 flex-col space-y-8">
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
              <PropertyAgentNotesInput />
            </div> */}

            <div className="flex w-full flex-col items-center gap-4 pt-4">
              <PropertySizeInput />
              <PropertyOwnershipTypeInput />
              <PropertyDivisibleSaleInput />
              <PropertyLandAndConstructionInput />
              <PropertyLandFeaturesInput />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-1 flex-col space-y-8">
            <PropertyImagesInput />
            <PropertyRoomsInputGroup />
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
