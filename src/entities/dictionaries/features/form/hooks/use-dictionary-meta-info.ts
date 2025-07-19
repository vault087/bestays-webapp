import { useCallback, useId } from "react";
import { DBSerialID } from "@/entities/common";
import {
  useDictionaryFormStaticStore,
  useDictionaryFormStore,
  useDictionaryFormStoreActions,
} from "@/entities/dictionaries/features/form/store/dictionary-form.store.hooks";
import { useCharacterLimit } from "@/modules/shadcn/hooks/use-character-limit";

// Display hook for dictionary name
export function useDictionaryMetaInfoDisplay(id: DBSerialID): string | undefined {
  const dictionary = useDictionaryFormStore((state) => state.dictionaries[id]?.metadata?.info);
  return dictionary === null ? undefined : dictionary;
}

// Input hook for dictionary name
export function useDictionaryMetaInfoInput(
  id: DBSerialID,
  maxLength: number,
): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  characterCount: number;
  error?: string;
} {
  const { updateDictionary } = useDictionaryFormStoreActions();
  const { dictionaries } = useDictionaryFormStaticStore();
  const dictionary = dictionaries[id];
  const { value, setValue, characterCount } = useCharacterLimit({
    maxLength,
    initialValue: dictionary?.metadata?.info || "",
  });

  const inputId = useId();

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
    [id, setValue, updateDictionary],
  );

  return {
    inputId,
    value,
    onChange,
    placeholder: `Meta info`,
    characterCount,
    error: undefined,
  };
}
