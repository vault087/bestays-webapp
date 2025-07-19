import { useCallback, useId, useState } from "react";
import { DBSerialID } from "@/entities/common";
import {
  useDictionaryFormStore,
  useDictionaryFormStoreActions,
} from "@/entities/dictionaries/features/form/store/dictionary-form.store.hooks";

// Display hook for dictionary code
export function useDictionaryCodeDisplay(id: DBSerialID): string | undefined {
  return useDictionaryFormStore((state) => state.dictionaries[id]?.code);
}

// Input hook for dictionary code
export function useDictionaryCodeInput(id: DBSerialID): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
} {
  const dictionary = useDictionaryFormStore((state) => state.dictionaries[id]);
  const { updateDictionary } = useDictionaryFormStoreActions();
  const [value, setValue] = useState<string>(dictionary?.code || "");

  const inputId = useId();

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
