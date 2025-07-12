import { PropertyMultiOptionInput } from "./multi-options/property-multi-option-input";

export function PropertyLocationStrengths({ propertyId, locale }: { propertyId: string; locale: string }) {
  return (
    <PropertyMultiOptionInput
      propertyId={propertyId}
      field="location_strengths"
      dictionaryCode="location_strengths"
      locale={locale}
    />
  );
}
