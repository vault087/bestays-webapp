import { useCallback } from "react";
import { useDictionaryEntry, useDictionaryStore } from "@/entities/dictionaries/stores/hooks/use-dictionary-store";
import { generateInputId } from "@/utils";

// Display hook for dictionary entry code
export function useDictionaryEntryCodeDisplay(dictionaryId: number, entryId: number): string | undefined {
  const entry = useDictionaryEntry(dictionaryId, entryId);
  return entry?.code;
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
  // ✅ Single store access with validation methods
  const { entry, updateEntry, validateEntryCode } = useDictionaryStore((state) => ({
    entry: state.entries[dictionaryId]?.[entryId],
    updateEntry: state.updateEntry,
    validateEntryCode: state.validateEntryCode,
  }));

  // Generate a unique input ID using the utility
  const inputId = generateInputId("dictionary-entry", entryId.toString(), "code");

  // Handle change
  const onChange = useCallback(
    (value: string) => {
      updateEntry(dictionaryId, entryId, (draft) => {
        draft.code = value;
      });
    },
    [dictionaryId, entryId, updateEntry],
  );

  // Get validation error if any
  const error = entry?.code ? validateEntryCode(dictionaryId, entryId, entry.code) : "Code cannot be empty";

  return {
    inputId,
    value: entry?.code || "",
    onChange,
    placeholder: "Enter entry code",
    error,
  };
}
