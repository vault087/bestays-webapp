"use client";

import { useCallback, useMemo } from "react";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useOption, useOptionId, useOptionStoreActions } from "@cms/modules/properties/form/property-options";
import { PropertyOption } from "@cms/modules/properties/property.types";
import { generateInputId } from "@cms/modules/shared/form/utils/input-id.utils";

export function useOptionTextDisplay(field: keyof PropertyOption): string | undefined {
  return useOption((option) => option[field] as string);
}

// Create in shared/form/hooks/use-property-text-input.ts
export function useOptionTextInput(
  field: keyof PropertyOption,
  variant?: string,
): {
  inputId: string;
  value: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
} {
  const { t } = useCMSTranslations();
  const { propertyId, optionId } = useOptionId();
  const { updatePropertyOption } = useOptionStoreActions();
  const value = useOptionTextDisplay(field) || "";

  // Input ID for accessibility
  const inputId = useMemo(() => {
    return generateInputId("property-option", optionId, field.toString(), variant);
  }, [optionId, field, variant]);

  // Placeholder text using translations
  const placeholder = useMemo(() => {
    const fieldTranslationKey = `property.option.${field.toString()}.placeholder`;
    return t(fieldTranslationKey);
  }, [t, field]);

  // Change handler with field-specific validation (use action)
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.trim();
      updatePropertyOption(propertyId, optionId, (draft) => {
        (draft[field] as string) = value;
      });
    },
    [updatePropertyOption, propertyId, optionId, field],
  );

  return {
    inputId,
    value,
    placeholder,
    onChange,
  };
}
