import { useCallback, useMemo } from "react";
import { useDictionary, useDictionaryActions } from "@/entities/dictionaries/stores/hooks/use-dictionary-store";
import { generateInputId } from "@/utils/generate-input-id";

// Display hook for dictionary name
export function useDictionaryDescriptionDisplay(id: number): string | undefined {
  const dictionary = useDictionary(id);
  const description = dictionary?.description;
  return description === null ? undefined : description;
}

// Input hook for dictionary name
export function useDictionaryDescriptionInput(id: number): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
} {
  const dictionary = useDictionary(id);
  const { updateDictionary } = useDictionaryActions();

  // Generate a unique input ID
  const inputId = useMemo(() => generateInputId("dictionary", id.toString(), "description"), [id]);

  // Handle change
  const onChange = useCallback(
    (value: string) => {
      updateDictionary(id, (draft) => {
        draft.description = value;
      });
    },
    [id, updateDictionary],
  );

  return {
    inputId,
    value: dictionary?.description || "",
    onChange,
    placeholder: `Enter dictionary description`,
    error: undefined,
  };
}
