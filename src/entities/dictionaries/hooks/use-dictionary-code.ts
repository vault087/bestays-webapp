import { useCallback } from "react";
import { useDictionary, useDictionaryStore } from "@/entities/dictionaries/stores/hooks/use-dictionary-store";

// Display hook for dictionary code
export function useDictionaryCodeDisplay(id: number): string | undefined {
  const dictionary = useDictionary(id);
  return dictionary?.code as string | undefined;
}

// Input hook for dictionary code
export function useDictionaryCodeInput(id: number): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
} {
  const dictionary = useDictionary(id);
  const updateDictionary = useDictionaryStore((state) => state.updateDictionary);

  const inputId = `dictionary-code-${id}`;

  // Handle change
  const onChange = useCallback(
    (value: string) => {
      updateDictionary(id, (draft) => {
        draft.code = value;
      });
    },
    [id, updateDictionary],
  );

  const error = undefined;

  return {
    inputId,
    value: (dictionary?.code as string) || "",
    onChange,
    placeholder: "Enter dictionary code",
    error,
  };
}
