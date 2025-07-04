"use client";

import { createContext, memo } from "react";

export type OptionIdContextType = {
  propertyId: string;
  optionId: string;
};

export const OptionIdContext = createContext<OptionIdContextType | null>(null);

export const OptionIdProvider = memo(
  ({ propertyId, optionId, children }: { propertyId: string; optionId: string; children: React.ReactNode }) => {
    return <OptionIdContext.Provider value={{ propertyId, optionId }}>{children}</OptionIdContext.Provider>;
  },
);

OptionIdProvider.displayName = "PropertyOptionIdProvider";
