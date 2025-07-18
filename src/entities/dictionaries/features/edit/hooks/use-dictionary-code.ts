import { useCallback, useMemo, useState } from "react";
import { useDictionaryStoreContext } from "@/entities/dictionaries/store/dictionary-store.context";
import { useDictionaryOnlySlice } from "@/entities/dictionaries/store/hooks";
import { generateInputId } from "@/utils/generate-input-id";

// Display hook for dictionary code
export function useDictionaryCodeDisplay(id: number): string | undefined {
  return useDictionaryOnlySlice((state) => state.dictionaries[id]?.code);
}

// Input hook for dictionary code
export function useDictionaryCodeInput(id: number): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
} {
  const store = useDictionaryStoreContext();
  const { updateDictionary } = store.getState();
  const dictionary = store.getState().dictionaries[id];
  const [value, setValue] = useState<string>(dictionary?.code || "");

  const inputId = useMemo(() => generateInputId("dict", id.toString(), "code"), [id]);

  // Handle change
  const onChange = useCallback(
    (value: string) => {
      setValue(value);
      updateDictionary(id, (draft) => {
        draft.code = value;
      });
    },
    [id, updateDictionary],
  );

  const error = undefined;

  return {
    inputId,
    value,
    onChange,
    placeholder: "Code",
    error,
  };
}
