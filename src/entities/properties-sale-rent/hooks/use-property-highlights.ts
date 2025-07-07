import { usePropertyArrayCodeField } from "./utils/use-property-code-field";

// Hook for property highlights field - uses multiple code selection
export function usePropertyHighlights(
  propertyId: string,
  locale: string = "en",
): ReturnType<typeof usePropertyArrayCodeField> {
  return usePropertyArrayCodeField(propertyId, "highlights", locale);
}
