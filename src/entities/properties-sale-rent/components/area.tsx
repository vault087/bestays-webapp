import { PropertyOptionInput } from "./core/property-option-input";

export function PropertyArea({ propertyId, locale }: { propertyId: string; locale: string }) {
  return <PropertyOptionInput propertyId={propertyId} field="area" dictionary="areas" locale={locale} />;
}
