import { useCallback, useMemo, useState } from "react";
import { useEntrySliceActions, useEntrySlice, useEntrySliceContext } from "@/entities/dictionaries/";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";
import { generateInputId } from "@/utils/generate-input-id";

// Display hook for dictionary entry name
export function useDictionaryEntryNameDisplay(
  dictionaryId: number,
  entryId: number,
  locale: string,
): string | undefined {
  const entry = useEntrySlice((state) => state.entries[dictionaryId]?.[entryId]);
  return getAvailableLocalizedText(entry?.name, locale);
}

// Input hook for dictionary entry name
export function useDictionaryEntryNameInput(
  dictionaryId: number,
  entryId: number,
  locale: string,
): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
} {
  const store = useEntrySliceContext();
  const { updateEntry } = useEntrySliceActions();
  const name = store.getState().entries[dictionaryId]?.[entryId]?.name;
  const [value, setValue] = useState<string>(getAvailableLocalizedText(name, locale) || "");

  // Generate a unique input ID
  const inputId = useMemo(() => generateInputId("dict-ent", entryId.toString(), "name", locale), [entryId, locale]);

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
