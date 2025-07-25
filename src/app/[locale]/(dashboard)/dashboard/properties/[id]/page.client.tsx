"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState, memo, useMemo } from "react";
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
import { usePropertyBoolInput } from "@/entities/properties-sale-rent/features/form/hooks/use-bool-field";
import LocaleSwitcher from "@/modules/i18n/components/locale-switcher";
import { useRouter } from "@/modules/i18n/core/client/navigation";
import { cn, Button, Input } from "@/modules/shadcn";
import { Label } from "@/modules/shadcn/components/ui/label";
import { Switch } from "@/modules/shadcn/components/ui/switch";

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
                  <div className="flex pr-4">
                    <PublishedToggle />
                  </div>
                  <div className="flex flex-row space-x-6">
                    <SaveButton />
                  </div>
                  <LocaleSwitcher />
                  <ThemeSwitcher />
                  <AvatarMenu />
                </div>
              </div>

              <div className="flex flex-col overflow-auto">
                <PropertyListCanvas />
                <div className="flex flex-row items-center justify-center space-x-6 py-4">
                  <DeleteButton />
                </div>
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

export const PublishedToggle = memo(function PublishedInput() {
  const { inputId, value, onChange } = usePropertyBoolInput("is_published");

  const t = useTranslations("Properties.fields.published");

  return (
    <div className="flex flex-row items-center gap-2">
      <Label
        htmlFor={inputId}
        className={cn("text-sm font-medium", value && "text-primary", !value && "text-muted-foreground")}
      >
        {t("is_published")}
      </Label>
      <Switch
        checked={value}
        onCheckedChange={onChange}
        id={inputId}
        className="data-[state=unchecked]:border-input data-[state=unchecked]:[&_span]:bg-input data-[state=unchecked]:bg-transparent [&_span]:transition-all data-[state=unchecked]:[&_span]:size-4 data-[state=unchecked]:[&_span]:translate-x-0.5 data-[state=unchecked]:[&_span]:shadow-none data-[state=unchecked]:[&_span]:rtl:-translate-x-0.5"
      />
    </div>
  );
});

export const SaveButton = memo(function SaveButton() {
  return <Button size="sm">Save</Button>;
});

export const DeleteButton = memo(function DeleteButton() {
  return (
    <Button variant="destructive" size="sm" className="opacity-50 hover:opacity-100">
      Delete
    </Button>
  );
});
