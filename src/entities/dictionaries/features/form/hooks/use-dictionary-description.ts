import { useCallback, useId } from "react";
import { DBSerialID } from "@/entities/common";
import {
  useDictionaryFormStore,
  useDictionaryFormStoreActions,
  useDictionaryFormStaticStore,
} from "@/entities/dictionaries/features/form/store/dictionary-form.store.hooks";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";
import { useCharacterLimit } from "@/modules/shadcn/hooks/use-character-limit";

// Display hook for dictionary name
export function useDictionaryDescriptionDisplay(id: DBSerialID, locale: string): string | undefined {
  return useDictionaryFormStore((state) => getAvailableLocalizedText(state.dictionaries[id]?.description, locale));
}

// Input hook for dictionary name
export function useDictionaryDescriptionInput(
  id: DBSerialID,
  locale: string,
  maxLength: number,
): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  characterCount: number;
  error?: string;
} {
  const { updateDictionary } = useDictionaryFormStoreActions();
  const { dictionaries } = useDictionaryFormStaticStore();
  const dictionary = dictionaries[id];
  const { value, setValue, characterCount } = useCharacterLimit({
    maxLength,
    initialValue: dictionary?.description?.[locale] || "",
  });

  const inputId = useId();

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
    [id, locale, setValue, updateDictionary],
  );

  // Validate - name should not be empty for primary locale
  // This is a simplified version - a real implementation might have more validation
  const error = undefined;

  return {
    inputId,
    value: value || "",
    onChange,
    placeholder: `Description (${locale})`,
    characterCount,
    error,
  };
}
