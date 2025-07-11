import { useCallback, useMemo } from "react";
import {
  useDictionaryActions,
  useDictionaryEntry,
  useDictionaryStore,
} from "@/entities/dictionaries/stores/hooks/use-dictionary-store";
import { DictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";
import { generateInputId } from "@/utils";

// Display hook for dictionary entry code
export function useDictionaryEntryCodeDisplay(dictionaryId: number, entryId: number): string | undefined {
  return useDictionaryStore((state) => state.entries[dictionaryId]?.[entryId]?.code) || undefined;
}

// Input hook for dictionary entry code
export function useDictionaryEntryCodeInput(
  dictionaryId: number,
  entryId: number,
): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
} {
  const entry = useDictionaryEntry(dictionaryId, entryId);
  const { updateEntry, validateEntryCode } = useDictionaryActions();

  // Generate a unique input ID using the utility
  const inputId = useMemo(() => generateInputId("dictionary-entry", entryId.toString(), "code"), [entryId]);

  // Handle change
  const onChange = useCallback(
    (value: string) => {
      updateEntry(dictionaryId, entryId, (draft: DictionaryEntry) => {
        draft.code = value;
      });
    },
    [dictionaryId, entryId, updateEntry],
  );

  // Memoize error computation to prevent unnecessary validations
  const error = useMemo(() => {
    if (!entry?.code) return "Code cannot be empty";
    return validateEntryCode(dictionaryId, entryId, entry.code);
  }, [entry?.code, validateEntryCode, dictionaryId, entryId]);

  return {
    inputId,
    value: entry?.code || "",
    onChange,
    placeholder: "Enter entry code",
    error,
  };
}
