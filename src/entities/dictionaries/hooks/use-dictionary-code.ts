import { useCallback, useMemo } from "react";
import { useDictionary, useDictionaryActions } from "@/entities/dictionaries/stores/hooks/use-dictionary-store";
import { generateInputId } from "@/utils/generate-input-id";

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
  const { updateDictionary } = useDictionaryActions();
  const dictionary = useDictionary(id);

  const inputId = useMemo(() => generateInputId("dictionary", id.toString(), "code"), [id]);

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
