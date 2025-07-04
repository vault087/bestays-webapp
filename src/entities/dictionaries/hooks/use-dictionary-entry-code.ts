import { useCallback } from "react";
import { useDictionaryEntry, useDictionaryStore } from "@/entities/dictionaries/stores/hooks/use-dictionary-store";

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
  const entry = useDictionaryEntry(dictionaryId, entryId);
  const updateEntry = useDictionaryStore((state) => state.updateEntry);
  const entries = useDictionaryStore((state) => state.entries[dictionaryId] || {});

  // Generate a unique input ID
  const inputId = `dictionary-entry-code-${dictionaryId}-${entryId}`;

  // Handle change
  const onChange = useCallback(
    (value: string) => {
      updateEntry(dictionaryId, entryId, (draft) => {
        draft.code = value;
      });
    },
    [dictionaryId, entryId, updateEntry],
  );

  // Validate for uniqueness and emptiness
  const isDuplicate = Object.values(entries).some(
    (otherEntry) => otherEntry.id !== entryId && otherEntry.code === entry?.code,
  );

  const error = !entry?.code
    ? "Code cannot be empty"
    : isDuplicate
      ? "Code must be unique within this dictionary"
      : undefined;

  return {
    inputId,
    value: entry?.code || "",
    onChange,
    placeholder: "Enter entry code",
    error,
  };
}
