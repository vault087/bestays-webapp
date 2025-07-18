import { useCallback, useMemo, useState } from "react";
import { DBSerialID } from "@/entities/common";
import { useEntrySliceGetState, useEntrySliceSelector } from "@/entities/dictionaries/";
import { getAvailableLocalizedText } from "@/entities/localized-text/utils/get-available-localized-text";
import { generateInputId } from "@/utils/generate-input-id";

// Display hook for dictionary entry name
export function useDictionaryEntryNameDisplay(
  dictionaryId: DBSerialID,
  entryId: DBSerialID,
  locale: string,
): string | undefined {
  const entry = useEntrySliceSelector((state) => state.entries[dictionaryId]?.[entryId]);
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
  const storeGetState = useEntrySliceGetState();
  const { updateEntry } = storeGetState;
  const name = storeGetState.entries[dictionaryId]?.[entryId]?.name;
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
