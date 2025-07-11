"use client";

import { useLocale } from "next-intl";
import React, { use } from "react";
import { DebugCard } from "@/components/ui/debug-json-card";
import { createDictionaryStore, DictionaryStoreProvider } from "@/entities/dictionaries";
import { GetDictionariesActionResponse } from "@/entities/dictionaries/actions";
import {
  PropertyStoreHydrated,
  PropertyStoreProvider,
  createPropertyStore,
  PropertyTitleInput,
  PropertyDescriptionInput,
  PropertyArea,
  PropertyHighlights,
  usePropertyStore,
  PropertyDivisibleSale,
  PropertyOwnershipType,
  PropertyType,
} from "@/entities/properties-sale-rent";
import { GetPropertiesActionResponse } from "@/entities/properties-sale-rent/actions";

interface PropertiesSellRentPageContentProps {
  propertiesPromise: GetPropertiesActionResponse;
  dictionariesPromise: GetDictionariesActionResponse;
}

export default function PropertiesSellRentPageContent({
  propertiesPromise,
  dictionariesPromise,
}: PropertiesSellRentPageContentProps) {
  const { properties, error: propertiesError } = use(propertiesPromise);
  const { dictionaries, entries, error: dictionariesError } = use(dictionariesPromise);

  const propertyStore = React.useMemo(() => createPropertyStore("properties-sell-rent", properties), [properties]);
  const dictionaryStore = React.useMemo(() => createDictionaryStore(dictionaries, entries), [dictionaries, entries]);
  const locale = useLocale();

  // Handle errors
  if (propertiesError || dictionariesError) {
    return (
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Error Loading Data</h1>
        {propertiesError && <div className="mb-2 text-red-500">Properties: {propertiesError}</div>}
        {dictionariesError && <div className="mb-2 text-red-500">Dictionaries: {dictionariesError}</div>}
      </div>
    );
  }

  return (
    <DictionaryStoreProvider store={dictionaryStore}>
      <PropertyStoreProvider store={propertyStore}>
        <PropertyStoreHydrated fallback={<div></div>}>
          <div>PropertiesSellRentPageContent</div>
          <div className="flex flex-row gap-4">
            <div className="flex w-1/2 flex-col gap-4">
              {Object.values(properties).map((property) => (
                <div key={property.id} className="space-y-4 rounded-lg border p-4">
                  <h3 className="text-lg font-semibold">Property {property.id.slice(-8)}</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <PropertyTitleInput id={property.id} locale={locale} />
                    <PropertyDescriptionInput id={property.id} locale={locale} />
                    <PropertyArea propertyId={property.id} locale={locale} />
                    <PropertyOwnershipType propertyId={property.id} locale={locale} />
                    <PropertyType propertyId={property.id} locale={locale} />
                    <PropertyDivisibleSale propertyId={property.id} locale={locale} />
                    <PropertyHighlights propertyId={property.id} locale={locale} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex w-1/2 flex-col gap-4">
              <ReactiveDebugCard />
            </div>
          </div>
        </PropertyStoreHydrated>
      </PropertyStoreProvider>
    </DictionaryStoreProvider>
  );
}

function ReactiveDebugCard() {
  // ✅ FIXED: Single subscription instead of multiple to prevent infinite loops
  const properties = usePropertyStore((state) => state.properties);

  return <DebugCard label="Error State Debug" json={{ properties }} />;
}
