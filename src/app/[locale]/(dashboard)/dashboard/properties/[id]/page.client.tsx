"use client";
import { ArrowLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import AvatarMenu from "@/components/dashboard-nav-bar/avatar-menu";
import { ThemeSwitcher } from "@/components/theme/components/theme-switcher";
import { DebugCard } from "@/components/ui/debug-json-card";
import { createDictionaryFormStore } from "@/entities/dictionaries/features/form/store";
import { DictionaryFormStoreProvider } from "@/entities/dictionaries/features/form/store/dictionary-form.store.provider";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";
import {
  PropertyFormStoreProvider,
  MutableProperty,
  PropertyPersonalNotesInput,
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
  PropertySalePriceInput,
  PropertyRentPriceInput,
  PropertyFormStoreHydrated,
  usePropertyTextInput,
  PROPERTY_PERSONAL_NOTES_MAX,
  // PropertyPriceInputGroup,
} from "@/entities/properties-sale-rent/";
import { PropertyImagesInput } from "@/entities/properties-sale-rent/features/form/components/images-input";
import LocaleSwitcher from "@/modules/i18n/components/locale-switcher";
import { useRouter } from "@/modules/i18n/core/client/navigation";
import { cn, Button, Input } from "@/modules/shadcn";

export default function PropertiesPageClient({
  property,
  dictionaries,
  entries,
}: {
  property: MutableProperty;
  dictionaries: DBDictionary[];
  entries: DBDictionaryEntry[];
}) {
  const router = useRouter();

  const dictionaryStore = useMemo(() => createDictionaryFormStore(dictionaries, entries), [dictionaries, entries]);
  const propertyStore = useMemo(() => createPropertyFormStore("properties-sell-rent", property), [property]);

  return (
    <div className="flex h-full w-full">
      <DictionaryFormStoreProvider store={dictionaryStore}>
        <PropertyFormStoreProvider store={propertyStore}>
          <PropertyFormStoreHydrated fallback={<div>Loading...</div>}>
            <div className="flex w-full flex-col gap-4 pt-4">
              <div className="flex w-full flex-row items-center justify-between px-6">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/properties")}>
                    <ArrowLeftIcon className="!h-6 !w-6" />
                  </Button>
                  {/* <h1 className="text-xl font-bold">Listing editor</h1> */}
                  <TitleInput />
                </div>

                <div className="flex items-center gap-2"></div>

                <div className="min-w-sm pt-4">{/* <Comp439 /> */}</div>

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
    <div className={cn("bg-background w-full px-5 pt-2", className)}>
      {/* Editing Area */}
      {/* <div className="w-full"> */}
      {/* Fields Container */}
      <div className="rounded-card flex flex-1 flex-col items-start justify-center gap-4 rounded-md p-0 sm:flex-row">
        {/* Left Column */}
        <div className="contents w-1/2 flex-col space-y-4 pb-8 sm:flex">
          {/* <PropertyTitleInput /> */}
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
          <div className="grid w-full grid-cols-2 gap-4">
            <PropertyRentPriceInput />
            <PropertySalePriceInput />
          </div>
          <PropertyAboutInput />
          <PropertyPersonalNotesInput />
        </div>
        {/* <ReactiveDebugCard /> */}
      </div>
      {/* </div> */}
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

export const TitleInput = memo(function TitleInput() {
  const { inputId, value, onChange } = usePropertyTextInput("personal_title", PROPERTY_PERSONAL_NOTES_MAX);
  const t = useTranslations("Properties.fields.title");
  return (
    <div className="flex flex-col gap-2">
      <Input
        className={cn(
          "placeholder:muted-foreground text-foreground h-20 border-0 font-medium shadow-none md:text-3xl",
          value.length > 0 && "",
        )}
        id={inputId}
        value={value}
        placeholder={t("no_title")}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
});
