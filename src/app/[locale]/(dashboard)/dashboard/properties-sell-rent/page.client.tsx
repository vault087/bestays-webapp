"use client";
import { ArrowLeftIcon } from "lucide-react";
import { memo, useMemo } from "react";
import AvatarMenu from "@/components/dashboard-nav-bar/avatar-menu";
import { ThemeSwitcher } from "@/components/theme/components/theme-switcher";
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
  PropertyAboutInput,
  // PropertyPriceInputGroup,
} from "@/entities/properties-sale-rent/";
import { PropertyImagesInput } from "@/entities/properties-sale-rent/features/form/components/images-input";
import LocaleSwitcher from "@/modules/i18n/components/locale-switcher";
import { cn, Button } from "@/modules/shadcn";
import Comp439 from "@/modules/shadcn/components/comp-439";

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
            <div className="flex w-full flex-col gap-4 pt-6">
              <div className="flex w-full flex-row items-center justify-between px-6">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <ArrowLeftIcon className="!h-6 !w-6" />
                  </Button>
                  <h1 className="text-xl font-bold">Listing editor</h1>
                </div>
                <div className="min-w-sm pt-4">
                  <Comp439 />
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <LocaleSwitcher />
                  <ThemeSwitcher />
                  <AvatarMenu />
                </div>
              </div>

              <div className="flex overflow-auto">
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
      <div className="rounded-card flex flex-1 flex-col items-start justify-center gap-4 rounded-md p-0 sm:flex-row">
        {/* Left Column */}
        <div className="contents w-1/2 flex-col space-y-4 pb-8 sm:flex">
          <PropertyAreaInput />
          <PropertyPropertyTypeInput />
          {/* <div className="flex w-1/2 flex-col items-start gap-4">
              <PropertyPriceInputGroup direction="vertical" />
            </div> */}
          <>
            <PropertyHighlightsInput />
            <PropertyLocationStrengthsInput />
            <PropertyNearbyAttractionsInput />
          </>
          {/* <div className="flex w-full flex-col space-y-4">
              <PropertyAboutInput />
            </div> */}
          <PropertyRoomsInputGroup />
          <>
            <PropertySizeInput />
            <PropertyOwnershipTypeInput />
            <PropertyDivisibleSaleInput />
            <PropertyLandAndConstructionInput />
            <PropertyLandFeaturesInput />
          </>
        </div>

        {/* Right Column */}
        <div className="contents w-1/2 flex-col space-y-4 sm:flex">
          <PropertyImagesInput />
          <PropertyAboutInput />
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
