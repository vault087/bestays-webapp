import { useCallback, useMemo, useState } from "react";
import { DBSerialID } from "@/entities/common";
import { useDictionarySliceGetState, useDictionarySliceSelector } from "@/entities/dictionaries/stores";
import { generateInputId } from "@/utils/generate-input-id";

// Display hook for dictionary name
export function useDictionaryMetaInfoDisplay(id: DBSerialID): string | undefined {
  const dictionary = useDictionarySliceSelector((state) => state.dictionaries[id]?.metadata?.info);
  return dictionary === null ? undefined : dictionary;
}

// Input hook for dictionary name
export function useDictionaryMetaInfoInput(id: DBSerialID): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
} {
  const storeGetState = useDictionarySliceGetState();
  const { updateDictionary } = storeGetState;
  const dictionary = storeGetState.dictionaries[id];
  const [value, setValue] = useState<string>(dictionary?.metadata?.info || "");

  // Generate a unique input ID
  const inputId = useMemo(() => generateInputId("dict", id.toString(), "meta-info"), [id]);

  // Handle change
  const onChange = useCallback(
    (value: string) => {
      setValue(value);
      updateDictionary(id, (draft) => {
        if (!draft.metadata) {
          draft.metadata = { info: value };
        }
        draft.metadata.info = value;
      });
    },
    [id, updateDictionary],
  );

  return {
    inputId,
    value,
    onChange,
    placeholder: `Meta info`,
    error: undefined,
  };
}
