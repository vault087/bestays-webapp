import { PropertyOptionInput } from "./single-option/property-option";

export function PropertyArea({ propertyId, locale }: { propertyId: string; locale: string }) {
  return <PropertyOptionInput propertyId={propertyId} field="area" dictionaryCode="areas" locale={locale} />;
}
