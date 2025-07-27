"use client";
import { useCallback, useEffect, useId } from "react";
import { LocalizedText } from "@/entities/localized-text";
import {
  usePropertyFormStaticStore,
  DBPropertyLocalizedTextField,
  usePropertyFormStoreActions,
  usePropertyLocale,
  usePropertyFormStore,
} from "@/entities/properties-sale-rent/";
import { useCharacterLimit } from "@/modules/shadcn/hooks/use-character-limit";

// Display hook for MutableProperty localized fields
export function usePropertyLocalizedTextDisplay(field: DBPropertyLocalizedTextField): string | undefined {
  const locale = usePropertyLocale();
  return usePropertyFormStore((state) => state.property[field]?.[locale] as string | undefined);
}

// Input hook for MutableProperty localized fields
export function usePropertyLocalizedTextInput(
  field: DBPropertyLocalizedTextField,
  maxLength: number,
): {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  characterCount: number;
  error?: string;
} {
  const { updateProperty } = usePropertyFormStoreActions();
  const locale = usePropertyLocale();
  const { property } = usePropertyFormStaticStore();

  const initialValue = property[field] as LocalizedText | null | undefined;
  const { value, setValue, characterCount } = useCharacterLimit({
    maxLength,
    initialValue: initialValue?.[locale] || "",
  });

  useEffect(() => {
    setValue(initialValue?.[locale] || "");
  }, [initialValue, locale, setValue]);

  const inputId = useId();

  // Handle change
  const onChange = useCallback(
    (value: string) => {
      setValue(value);
      updateProperty((draft) => {
        const currentField = draft[field] as LocalizedText | null | undefined;
        if (!currentField) {
          (draft[field] as LocalizedText) = {};
        }
        (draft[field] as LocalizedText)[locale] = value.trim();
      });
    },
    [locale, updateProperty, field, setValue],
  );

  const error = undefined;

  return {
    inputId,
    value,
    onChange,
    characterCount,
    error,
  };
}
