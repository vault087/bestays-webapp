"use client";

import { useLocale } from "next-intl";
import React, { use } from "react";
import { DebugCard } from "@/components/ui/debug-json-card";
import { useDictionaryStore } from "@/entities/dictionaries";
import {
  PropertyStoreHydrated,
  PropertyStoreProvider,
  createPropertyStore,
  PropertyTitleDisplay,
  PropertyDescriptionDisplay,
  PropertyIdProvider,
  PropertyTitleInput,
  PropertyDescriptionInput,
  usePropertyStore,
} from "@/entities/properties-sale-rent";
import { GetPropertiesActionResponse } from "@/entities/properties-sale-rent/actions";
interface PropertiesSellRentPageContentProps {
  propertiesPromise: GetPropertiesActionResponse;
}

export default function PropertiesSellRentPageContent({ propertiesPromise }: PropertiesSellRentPageContentProps) {
  const { properties, error } = use(propertiesPromise);
  const store = React.useMemo(() => createPropertyStore("properties-sell-rent", properties), [properties]);
  const locale = useLocale();
  return (
    <PropertyStoreProvider store={store}>
      <PropertyStoreHydrated fallback={<div>Restoring store...</div>}>
        <div>PropertiesSellRentPageContent</div>
        <div className="flex flex-row gap-4">
          <div className="flex w-1/2 flex-col gap-4">
            {Object.values(properties).map((property) => (
              <div key={property.id} className="flex flex-row gap-4">
                <PropertyIdProvider propertyId={property.id}>
                  <PropertyTitleInput id={property.id} locale={locale} />
                  <PropertyDescriptionInput id={property.id} locale={locale} />
                </PropertyIdProvider>
              </div>
            ))}
            {error && <div>{error}</div>}
          </div>
          <div className="flex w-1/2 flex-col gap-4">
            <ReactiveDebugCard />
          </div>
        </div>
      </PropertyStoreHydrated>
    </PropertyStoreProvider>
  );
}

function ReactiveDebugCard() {
  // ✅ FIXED: Single subscription instead of multiple to prevent infinite loops
  const properties = usePropertyStore((state) => state.properties);

  return <DebugCard label="Error State Debug" json={{ properties }} />;
}
