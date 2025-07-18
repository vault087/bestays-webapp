import { useCallback, useMemo } from "react";
import {
  useDictionaryActions,
  useDictionaryStore,
} from "@/entities/dictionaries/features/edit/store/hooks/use-dictionary-store";
import { generateInputId } from "@/utils/generate-input-id";

// Display hook for dictionary name
export function useDictionaryMetaInfoDisplay(id: number): string | undefined {
  const dictionary = useDictionaryStore((state) => state.dictionaries[id]?.metadata?.info);
  return dictionary === null ? undefined : dictionary;
}

// Input hook for dictionary name
export function useDictionaryMetaInfoInput(id: number): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
} {
  const { updateDictionary } = useDictionaryActions();
  const value = useDictionaryMetaInfoDisplay(id);
  // Generate a unique input ID
  const inputId = useMemo(() => generateInputId("dict", id.toString(), "meta-info"), [id]);

  // Handle change
  const onChange = useCallback(
    (value: string) => {
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
    value: value || "",
    onChange,
    placeholder: `Enter dictionary description`,
    error: undefined,
  };
}
