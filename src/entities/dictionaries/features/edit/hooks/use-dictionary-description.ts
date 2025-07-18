import { useCallback, useMemo, useState } from "react";
import { useDictionaryOnlySliceContext } from "@/entities/dictionaries";
import { useDictionaryOnlySlice } from "@/entities/dictionaries/store/hooks";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";
import { generateInputId } from "@/utils/generate-input-id";
// Display hook for dictionary name
export function useDictionaryDescriptionDisplay(id: number, locale: string): string | undefined {
  return useDictionaryOnlySlice((state) => getAvailableLocalizedText(state.dictionaries[id]?.description, locale));
}

// Input hook for dictionary name
export function useDictionaryDescriptionInput(
  id: number,
  locale: string,
): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
} {
  const store = useDictionaryOnlySliceContext();
  const { updateDictionary } = store.getState();
  const dictionary = store.getState().dictionaries[id];
  const [value, setValue] = useState<string>(getAvailableLocalizedText(dictionary?.description, locale) || "");

  // Generate a unique input ID
  const inputId = useMemo(() => generateInputId("dict", id.toString(), "desc", locale), [id, locale]);

  // Handle change
  const onChange = useCallback(
    (value: string) => {
      setValue(value);
      updateDictionary(id, (draft) => {
        if (!draft.description) {
          draft.description = {};
        }
        draft.description[locale] = value;
      });
    },
    [id, locale, updateDictionary],
  );

  // Validate - name should not be empty for primary locale
  // This is a simplified version - a real implementation might have more validation
  const error = undefined;

  return {
    inputId,
    value: value || "",
    onChange,
    placeholder: `Description (${locale})`,
    error,
  };
}
