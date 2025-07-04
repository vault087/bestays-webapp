"use client";

import { useLocale } from "next-intl";
import { useMemo, useCallback } from "react";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useCustomLocale } from "@cms/modules/localization/hooks/use-custom-locale";
import { useProperty, usePropertyId, usePropertyStoreActions } from "@cms/modules/properties/form";
import type { FormProperty } from "@cms/modules/properties/form/types";
import { generateInputId } from "@cms/modules/shared/form/utils/input-id.utils";

export function useLocaleTextDisplay(field: keyof FormProperty, locale?: string): string | undefined {
  const currentLocale = useLocale();
  const customLocale = useCustomLocale();

  // ✅ FIX: If locale is explicitly passed, use it. Otherwise use context hierarchy
  const targetLocale = locale || customLocale || currentLocale;

  const property = useProperty((property) => {
    const fieldValue = property[field] as Record<string, string> | undefined;
    return fieldValue?.[targetLocale] || "";
  });

  return property;
}

export function useLocaleTextInput(
  field: keyof FormProperty,
  variant?: string,
  forceLocale?: string,
): {
  inputId: string;
  value: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  targetLocale: string;
} {
  const { t } = useCMSTranslations();
  const currentLocale = useLocale();
  const customLocale = useCustomLocale();
  const targetLocale = forceLocale || customLocale || currentLocale;

  const propertyId = usePropertyId();
  const { updateProperty } = usePropertyStoreActions();
  const value = useLocaleTextDisplay(field, targetLocale) || "";

  // Input ID for accessibility
  const inputId = useMemo(() => {
    return generateInputId("property", propertyId, field.toString(), variant, targetLocale);
  }, [propertyId, field, variant, targetLocale]);

  // Placeholder text using translations
  const placeholder = useMemo(() => {
    const fieldTranslationKey = `property.${field.toString()}.placeholder`;
    return t(fieldTranslationKey);
  }, [t, field]);

  // Change handler with translation update
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value.trim();
      updateProperty(propertyId, (draft) => {
        // Preserve object reference, only update specific locale
        const translationField = draft[field] as Record<string, string> | undefined;
        if (!translationField) {
          (draft[field] as Record<string, string>) = { [targetLocale]: value };
        } else {
          translationField[targetLocale] = value;
        }
      });
    },
    [updateProperty, propertyId, field, targetLocale],
  );

  return {
    inputId,
    value,
    placeholder,
    onChange,
    targetLocale,
  };
}
