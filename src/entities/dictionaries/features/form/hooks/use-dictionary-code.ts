import { useCallback, useId } from "react";
import { DBSerialID } from "@/entities/common";
import {
  useDictionaryFormStore,
  useDictionaryFormStoreActions,
} from "@/entities/dictionaries/features/form/store/dictionary-form.store.hooks";
import { useCharacterLimit } from "@/modules/shadcn/hooks/use-character-limit";

// Display hook for dictionary code
export function useDictionaryCodeDisplay(id: DBSerialID): string | undefined {
  return useDictionaryFormStore((state) => state.dictionaries[id]?.code);
}

// Input hook for dictionary code
export function useDictionaryCodeInput(
  id: DBSerialID,
  maxLength: number,
): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  characterCount: number;
  maxLength: number;
  error?: string;
} {
  const dictionary = useDictionaryFormStore((state) => state.dictionaries[id]);
  const { updateDictionary } = useDictionaryFormStoreActions();
  const { value, setValue, characterCount } = useCharacterLimit({
    maxLength,
    initialValue: dictionary?.code || "",
  });
  const inputId = useId();

  // Handle change
  const onChange = useCallback(
    (value: string) => {
      setValue(value);
      updateDictionary(id, (draft) => {
        draft.code = value.trim();
      });
    },
    [id, setValue, updateDictionary],
  );

  const error = undefined;

  return {
    inputId,
    value,
    onChange,
    characterCount,
    maxLength,
    error,
  };
}
