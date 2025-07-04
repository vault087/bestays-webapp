import { useCallback } from "react";
import { useDictionary, useDictionaryStore } from "@/entities/dictionaries/stores/hooks/use-dictionary-store";

// Display hook for dictionary type
export function useDictionaryTypeDisplay(id: number): string | undefined {
  const dictionary = useDictionary(id);
  return dictionary?.type;
}

// Input hook for dictionary type
export function useDictionaryTypeInput(id: number): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
} {
  const dictionary = useDictionary(id);
  const updateDictionary = useDictionaryStore((state) => state.updateDictionary);

  // Generate a unique input ID
  const inputId = `dictionary-type-${id}`;

  // Handle change
  const onChange = useCallback(
    (value: string) => {
      updateDictionary(id, (draft) => {
        draft.type = value;
      });
    },
    [id, updateDictionary],
  );

  // Validate for uniqueness (would need to check against other dictionaries)
  // This is a simplified version - a real implementation would check for uniqueness
  const error = dictionary?.type === "" ? "Type cannot be empty" : undefined;

  return {
    inputId,
    value: dictionary?.type || "",
    onChange,
    placeholder: "Enter dictionary type",
    error,
  };
}
