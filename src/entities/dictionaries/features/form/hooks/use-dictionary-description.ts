import { useCallback, useMemo, useState } from "react";
import { DBSerialID } from "@/entities/common";
import {
  useDictionaryFormStore,
  useDictionaryFormStaticStore,
} from "@/entities/dictionaries/features/form/store/dictionary-form.store.hooks";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";
import { generateInputId } from "@/utils/generate-input-id";
// Display hook for dictionary name
export function useDictionaryDescriptionDisplay(id: DBSerialID, locale: string): string | undefined {
  return useDictionaryFormStore((state) => getAvailableLocalizedText(state.dictionaries[id]?.description, locale));
}

// Input hook for dictionary name
export function useDictionaryDescriptionInput(
  id: DBSerialID,
  locale: string,
): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
} {
  const staticState = useDictionaryFormStaticStore();
  const { updateDictionary } = staticState;
  const dictionary = staticState.dictionaries[id];
  const [value, setValue] = useState<string>(getAvailableLocalizedText(dictionary?.description, locale));

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
