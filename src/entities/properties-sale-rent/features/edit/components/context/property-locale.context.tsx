"use client";

import { useLocale } from "next-intl";
import { ReactNode, createContext, useContext, useMemo } from "react";

export type PropertyLocaleContextType = {
  locale: string;
};

// Create context with proper type safety
export const PropertyLocaleContext = createContext<PropertyLocaleContextType | null>(null);

// Store Provider props
export interface PropertyLocaleProviderProps {
  children: ReactNode;
  locale: string;
}

// Store Provider component
export const PropertyLocaleProvider = ({ children, locale }: PropertyLocaleProviderProps) => {
  const contextValue = useMemo(() => {
    return {
      locale,
    };
  }, [locale]);

  return <PropertyLocaleContext.Provider value={contextValue}>{children}</PropertyLocaleContext.Provider>;
};

// Context hook
export function usePropertyLocale(): string {
  const context = useContext(PropertyLocaleContext);
  const locale = useLocale();
  return context?.locale || locale;
}
