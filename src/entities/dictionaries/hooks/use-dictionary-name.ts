import { useCallback, useMemo } from "react";
import { useDictionary, useDictionaryActions } from "@/entities/dictionaries/stores/hooks/use-dictionary-store";
import { generateInputId } from "@/utils/generate-input-id";

// Display hook for dictionary name
export function useDictionaryNameDisplay(id: number, locale: string): string | undefined {
  const dictionary = useDictionary(id);
  const name = dictionary?.name?.[locale];
  return name === null ? undefined : name;
}

// Input hook for dictionary name
export function useDictionaryNameInput(
  id: number,
  locale: string,
): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
} {
  const dictionary = useDictionary(id);
  const { updateDictionary } = useDictionaryActions();

  // Generate a unique input ID
  const inputId = useMemo(() => generateInputId("dictionary", id.toString(), "name", locale), [id, locale]);

  // Handle change
  const onChange = useCallback(
    (value: string) => {
      updateDictionary(id, (draft) => {
        if (!draft.name) {
          draft.name = {};
        }
        draft.name[locale] = value;
      });
    },
    [id, locale, updateDictionary],
  );

  // Validate - name should not be empty for primary locale
  // This is a simplified version - a real implementation might have more validation
  const error = undefined;

  return {
    inputId,
    value: dictionary?.name?.[locale] || "",
    onChange,
    placeholder: `Enter dictionary name (${locale})`,
    error,
  };
}
