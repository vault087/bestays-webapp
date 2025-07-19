import { useCallback, useMemo, useState } from "react";
import { DBSerialID } from "@/entities/common";
import { useDictionaryFormStore, useDictionaryFormStoreDebounced } from "@/entities/dictionaries/features/form/store";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";
import { generateInputId } from "@/utils/generate-input-id";

// Display hook for dictionary name
export function useDictionaryNameDisplay(id: DBSerialID, locale: string): string | undefined {
  return useDictionaryFormStore((state) => getAvailableLocalizedText(state.dictionaries[id]?.name, locale));
}

// Input hook for dictionary name
export function useDictionaryNameInput(
  id: DBSerialID,
  locale: string,
): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
} {
  const { updateDictionary } = useDictionaryFormStoreDebounced();
  const name = useDictionaryFormStore((state) => state.dictionaries[id]?.name);
  const [value, setValue] = useState<string>(getAvailableLocalizedText(name, locale));

  // Generate a unique input ID
  const inputId = useMemo(() => generateInputId("dict", id.toString(), "name", locale), [id, locale]);

  // Handle change
  const onChange = useCallback(
    (value: string) => {
      setValue(value);

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
    value,
    onChange,
    placeholder: `Name (${locale})`,
    error,
  };
}
