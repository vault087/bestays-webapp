import { PropertyMultiOptionCheckbox } from "./multi-options/property-multi-option-checkbox";

export function PropertyHighlights({ propertyId, locale }: { propertyId: string; locale: string }) {
  return (
    <PropertyMultiOptionCheckbox
      propertyId={propertyId}
      field="highlights"
      dictionaryCode="highlights"
      locale={locale}
    />
  );
}
