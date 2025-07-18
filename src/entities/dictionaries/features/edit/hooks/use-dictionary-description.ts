import { useCallback, useMemo } from "react";
import {
  useDictionaryActions,
  useDictionaryStore,
} from "@/entities/dictionaries/features/edit/store/hooks/use-dictionary-store";
import { generateInputId } from "@/utils/generate-input-id";

// Display hook for dictionary name
export function useDictionaryDescriptionDisplay(id: number, locale: string): string | undefined {
  return useDictionaryStore((state) => state.dictionaries[id]?.description?.[locale]);
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
  const value = useDictionaryDescriptionDisplay(id, locale);
  const { updateDictionary } = useDictionaryActions();

  // Generate a unique input ID
  const inputId = useMemo(() => generateInputId("dict", id.toString(), "desc", locale), [id, locale]);

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
    value: value || "",
    onChange,
    placeholder: `Enter dictionary name (${locale})`,
    error,
  };
}
