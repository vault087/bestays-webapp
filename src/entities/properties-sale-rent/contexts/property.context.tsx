"use client";

import { createContext, memo } from "react";
import { Property } from "@/entities/properties-sale-rent/types/property.type";

export type PropertyContextConfig = {
  property: Property | null;
  updateProperty: (draft: Property) => void;
  hasHydrated: boolean;
  customLocale?: string;
};

export const PropertyContext = createContext<PropertyContextConfig>({
  property: null,
  updateProperty: () => {},
  hasHydrated: false,
  customLocale: undefined,
});

const PropertyProviderComponent = ({
  config,
  children,
}: {
  config: PropertyContextConfig;
  children: React.ReactNode;
}) => {
  return <PropertyContext.Provider value={config}>{children}</PropertyContext.Provider>;
};

export const PropertyProvider = memo(PropertyProviderComponent);
