import { useCallback, useId } from "react";
import { DBSerialID } from "@/entities/common";
import { useDictionaryFormStore, useDictionaryFormStoreActions } from "@/entities/dictionaries/features/form/store";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";
import { useCharacterLimit } from "@/modules/shadcn/hooks/use-character-limit";

// Display hook for dictionary name
export function useDictionaryNameDisplay(id: DBSerialID, locale: string): string | undefined {
  return useDictionaryFormStore((state) => getAvailableLocalizedText(state.dictionaries[id]?.name, locale));
}

// Input hook for dictionary name
export function useDictionaryNameInput(
  id: DBSerialID,
  locale: string,
  maxLength: number,
): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  characterCount: number;
  maxLength: number;
  error?: string;
} {
  const { updateDictionary } = useDictionaryFormStoreActions();
  const name = useDictionaryFormStore((state) => state.dictionaries[id]?.name);
  const { value, setValue, characterCount } = useCharacterLimit({
    maxLength,
    initialValue: name?.[locale] || "",
  });

  const inputId = useId();

  // Handle change
  const onChange = useCallback(
    (value: string) => {
      setValue(value);

      updateDictionary(id, (draft) => {
        if (!draft.name) {
          draft.name = {};
        }
        draft.name[locale] = value.trim();
      });
    },
    [id, locale, setValue, updateDictionary],
  );

  // Validate - name should not be empty for primary locale
  // This is a simplified version - a real implementation might have more validation
  const error = undefined;

  return {
    inputId,
    value,
    onChange,
    characterCount,
    maxLength,
    error,
  };
}
