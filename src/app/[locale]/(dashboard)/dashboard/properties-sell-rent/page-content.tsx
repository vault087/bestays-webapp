"use client";

import React, { use } from "react";
import { PropertyStoreHydrated, PropertyStoreProvider, createPropertyStore } from "@/entities/properties-sale-rent";
import { GetPropertiesActionResponse } from "@/entities/properties-sale-rent/actions";

interface PropertiesSellRentPageContentProps {
  propertiesPromise: GetPropertiesActionResponse;
}

export default function PropertiesSellRentPageContent({ propertiesPromise }: PropertiesSellRentPageContentProps) {
  const { properties, error } = use(propertiesPromise);
  const store = React.useMemo(() => createPropertyStore("properties-sell-rent", properties), [properties]);
  return (
    <PropertyStoreProvider store={store}>
      <PropertyStoreHydrated fallback={<div>Restoring store...</div>}>
        <div>PropertiesSellRentPageContent</div>
        {Object.values(properties).map((property) => (
          <div key={property.id}>{JSON.stringify(property)}</div>
        ))}
        {error && <div>{error}</div>}
      </PropertyStoreHydrated>
    </PropertyStoreProvider>
  );
}
