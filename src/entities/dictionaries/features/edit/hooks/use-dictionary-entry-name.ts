import { useCallback, useMemo } from "react";
import {
  useDictionaryActions,
  useDictionaryEntry,
} from "@/entities/dictionaries/features/edit/store/use-dictionary-store";
import { generateInputId } from "@/utils/generate-input-id";

// Display hook for dictionary entry name
export function useDictionaryEntryNameDisplay(
  dictionaryId: number,
  entryId: number,
  locale: string,
): string | undefined {
  const entry = useDictionaryEntry(dictionaryId, entryId);
  const name = entry?.name?.[locale];
  return name === null ? undefined : name;
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
  const entry = useDictionaryEntry(dictionaryId, entryId);
  const { updateEntry } = useDictionaryActions();

  // Generate a unique input ID
  const inputId = useMemo(() => generateInputId("dict-ent", entryId.toString(), "name", locale), [entryId, locale]);

  // Handle change
  const onChange = useCallback(
    (value: string) => {
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
    value: entry?.name?.[locale] || "",
    onChange,
    placeholder: `Enter entry name (${locale})`,
    error,
  };
}
