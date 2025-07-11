import { PropertyMultiOptionInput } from "./core/property-multi-option-input";

export function PropertyHighlights({ propertyId, locale }: { propertyId: string; locale: string }) {
  return (
    <PropertyMultiOptionInput propertyId={propertyId} field="highlights" dictionaryCode="highlights" locale={locale} />
  );
}
