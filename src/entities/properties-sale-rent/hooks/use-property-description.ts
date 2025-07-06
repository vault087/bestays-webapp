import { usePropertyLocalizedFieldDisplay, usePropertyLocalizedFieldInput } from "./utils/use-property-localized-field";

// Display hook for Property description
export function usePropertyDescriptionDisplay(id: string, locale: string): string | undefined {
  return usePropertyLocalizedFieldDisplay(id, locale, "description");
}

// Input hook for Property description
export function usePropertyDescriptionInput(
  id: string,
  locale: string,
): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
} {
  return usePropertyLocalizedFieldInput(id, locale, "description");
}
