import { useCallback, useMemo, useState } from "react";
import { DBSerialID } from "@/entities/common";
import { useDictionarySliceSelector, useDictionarySliceGetState } from "@/entities/dictionaries/stores";
import { generateInputId } from "@/utils/generate-input-id";

// Display hook for dictionary code
export function useDictionaryCodeDisplay(id: DBSerialID): string | undefined {
  return useDictionarySliceSelector((state) => state.dictionaries[id]?.code);
}

// Input hook for dictionary code
export function useDictionaryCodeInput(id: DBSerialID): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
} {
  const storeGetState = useDictionarySliceGetState();
  const { updateDictionary } = storeGetState;
  const dictionary = storeGetState.dictionaries[id];
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
