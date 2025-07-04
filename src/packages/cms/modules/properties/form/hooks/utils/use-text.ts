"use client";

import { useCallback, useMemo } from "react";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { usePropertyId, useProperty, usePropertyStoreActions } from "@cms/modules/properties/form";
import { FormProperty } from "@cms/modules/properties/form/types";
import { generateInputId } from "@cms/modules/shared/form/utils/input-id.utils";

export function useTextDisplay(field: keyof FormProperty): string | undefined {
  return useProperty((property) => property[field] as string);
}

// Create in shared/form/hooks/use-property-text-input.ts
export function useTextInput(
  field: keyof FormProperty,
  variant?: string,
): {
  inputId: string;
  value: string;

  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
} {
  const { t } = useCMSTranslations();
  const propertyId = usePropertyId();
  const { updateProperty } = usePropertyStoreActions();
  const value = useTextDisplay(field) || "";

  // Input ID for accessibility
  const inputId = useMemo(() => {
    return generateInputId("property", propertyId, field.toString(), variant);
  }, [propertyId, field, variant]);

  // Placeholder text using translations
  const placeholder = useMemo(() => {
    const fieldTranslationKey = `property.${field.toString()}.placeholder`;
    return t(fieldTranslationKey);
  }, [t, field]);

  // Change handler with field-specific validation (use action)
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.trim();
      updateProperty(propertyId, (draft) => {
        (draft[field] as string) = value;
      });
    },
    [updateProperty, propertyId, field],
  );

  return {
    inputId,
    value,
    placeholder,
    onChange,
  };
}
