import { useCallback } from "react";
import { useDictionaryEntry, useDictionaryStore } from "@/entities/dictionaries/stores/hooks/use-dictionary-store";

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
  const updateEntry = useDictionaryStore((state) => state.updateEntry);

  // Generate a unique input ID
  const inputId = `dictionary-entry-name-${dictionaryId}-${entryId}-${locale}`;

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
  const error = locale === "en" && entry?.name?.[locale] === "" ? "Name cannot be empty for primary locale" : undefined;

  return {
    inputId,
    value: entry?.name?.[locale] || "",
    onChange,
    placeholder: `Enter entry name (${locale})`,
    error,
  };
}
