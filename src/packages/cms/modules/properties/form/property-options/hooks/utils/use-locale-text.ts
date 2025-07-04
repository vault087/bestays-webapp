"use client";

import { useLocale } from "next-intl";
import { useMemo, useCallback } from "react";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useCustomLocale } from "@cms/modules/localization/hooks/use-custom-locale";
import { useOption, useOptionId, useOptionStoreActions } from "@cms/modules/properties/form/property-options";
import { PropertyOption } from "@cms/modules/properties/property.types";
import { generateInputId } from "@cms/modules/shared/form/utils/input-id.utils";

export function useOptionLocaleTextDisplay(field: keyof PropertyOption, locale?: string): string | undefined {
  const currentLocale = useLocale();
  const customLocale = useCustomLocale();

  // ✅ FIX: If locale is explicitly passed, use it. Otherwise use context hierarchy
  const targetLocale = locale || customLocale || currentLocale;

  const propertyOption = useOption((option) => {
    const fieldValue = option[field] as Record<string, string> | undefined;
    return fieldValue?.[targetLocale] || "";
  });

  return propertyOption;
}

export function useOptionLocaleTextInput(
  field: keyof PropertyOption,
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

  const { propertyId, optionId } = useOptionId();
  const { updatePropertyOption } = useOptionStoreActions();
  const value = useOptionLocaleTextDisplay(field, targetLocale) || "";

  // Input ID for accessibility
  const inputId = useMemo(() => {
    return generateInputId("property-option", optionId, field.toString(), variant, targetLocale);
  }, [optionId, field, variant, targetLocale]);

  // Placeholder text using translations
  const placeholder = useMemo(() => {
    const fieldTranslationKey = `property.option.${field.toString()}.placeholder`;
    return t(fieldTranslationKey);
  }, [t, field]);

  // Change handler with translation update
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value.trim();
      updatePropertyOption(propertyId, optionId, (draft) => {
        // Preserve object reference, only update specific locale
        const translationField = draft[field] as Record<string, string> | undefined;
        if (!translationField) {
          (draft[field] as Record<string, string>) = { [targetLocale]: value };
        } else {
          translationField[targetLocale] = value;
        }
      });
    },
    [updatePropertyOption, propertyId, optionId, field, targetLocale],
  );

  return {
    inputId,
    value,
    placeholder,
    onChange,
    targetLocale,
  };
}
