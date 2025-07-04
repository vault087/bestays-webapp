import { useContext } from "react";
import { OptionIdContext, OptionIdContextType } from "@cms/modules/properties/form/property-options";

export const useOptionId = (): OptionIdContextType => {
  const context = useContext(OptionIdContext);
  if (!context) {
    throw new Error("useOptionId must be used within a OptionIdProvider");
  }
  return context;
};
