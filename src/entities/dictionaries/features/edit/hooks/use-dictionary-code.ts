import { useCallback, useMemo } from "react";
import {
  useDictionaryActions,
  useDictionaryStore,
} from "@/entities/dictionaries/features/edit/store/hooks/use-dictionary-store";
import { generateInputId } from "@/utils/generate-input-id";

// Display hook for dictionary code
export function useDictionaryCodeDisplay(id: number): string | undefined {
  return useDictionaryStore((state) => state.dictionaries[id]?.code);
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
  const dictionaryCode = useDictionaryCodeDisplay(id);

  const inputId = useMemo(() => generateInputId("dict", id.toString(), "code"), [id]);

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
    value: dictionaryCode || "",
    onChange,
    placeholder: "Enter dictionary code",
    error,
  };
}
