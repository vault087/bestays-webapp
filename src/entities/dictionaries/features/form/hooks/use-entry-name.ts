import { useCallback, useState, useId } from "react";
import { DBSerialID } from "@/entities/common";
import { useDictionaryFormStore, useDictionaryFormStoreActions } from "@/entities/dictionaries/features/form/store";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";

// Display hook for dictionary entry name
export function useDictionaryEntryNameDisplay(
  dictionaryId: DBSerialID,
  entryId: DBSerialID,
  locale: string,
): string | undefined {
  const entry = useDictionaryFormStore((state) => state.entries[dictionaryId]?.[entryId]);
  return getAvailableLocalizedText(entry?.name, locale);
}

// Input hook for dictionary entry name
export function useDictionaryEntryNameInput(
  dictionaryId: DBSerialID,
  entryId: DBSerialID,
  locale: string,
): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
} {
  const { updateEntry } = useDictionaryFormStoreActions();
  const name = useDictionaryFormStore((state) => state.entries[dictionaryId]?.[entryId]?.name);
  const [value, setValue] = useState<string>(getAvailableLocalizedText(name, locale));
  const inputId = useId();

  // Handle change
  const onChange = useCallback(
    (value: string) => {
      setValue(value);
      updateEntry(dictionaryId, entryId, (draft) => {
        if (!draft.name) {
          draft.name = {};
        }
        draft.name[locale] = value;
      });
    },
    [dictionaryId, entryId, locale, updateEntry],
  );

  // Validate - name should not be empty for primary locale
  const error = undefined;

  return {
    inputId,
    value,
    onChange,
    placeholder: `Option name (${locale})`,
    error,
  };
}
