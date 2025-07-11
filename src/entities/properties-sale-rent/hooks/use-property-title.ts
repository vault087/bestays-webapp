import { usePropertyLocalizedFieldDisplay, usePropertyLocalizedFieldInput } from "./utils/use-property-localized-field";

// Display hook for Property title
export function usePropertyTitleDisplay(id: string, locale: string): string | undefined {
  return usePropertyLocalizedFieldDisplay(id, locale, "title");
}

// Input hook for Property title
export function usePropertyTitleInput(
  id: string,
  locale: string,
): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
} {
  return usePropertyLocalizedFieldInput(id, locale, "title");
}
