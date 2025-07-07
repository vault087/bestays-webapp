import { usePropertySingleCodeField } from "./utils/use-property-code-field";

// Hook for property area field - uses single code selection
export function usePropertyArea(
  propertyId: string,
  locale: string = "en",
): ReturnType<typeof usePropertySingleCodeField> {
  return usePropertySingleCodeField(propertyId, "area", locale);
}
