"use client";

import { useMemo, useCallback } from "react";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { usePropertyId, usePropertyStoreActions, useProperty } from "@cms/modules/properties/form";
import { PropertyMetaNumber } from "@cms/modules/properties/property.types";
import { generateInputId } from "@cms/modules/shared/form/utils/input-id.utils";

export function useMetaNumberMaxDisplay(): string | undefined {
  return useMetaNumberDisplay("max");
}

export function useMetaNumberMinDisplay(): string | undefined {
  return useMetaNumberDisplay("min");
}

export function useMetaNumberDisplay(field: keyof Pick<PropertyMetaNumber, "max" | "min">): string | undefined {
  return useProperty((property) => {
    if (property.meta?.type !== "number") return undefined;
    return property.meta[field]?.toString() || undefined;
  });
}

export function useMetaNumberInteger(): {
  isActive: boolean;
  handleSetIsActive: (value: boolean) => void;
} {
  const propertyId = usePropertyId();
  const { updateProperty } = usePropertyStoreActions();
  const isActive = useProperty((p) => p.meta?.type === "number" && p.meta.integer);

  const handleSetIsActive = useCallback(
    (value: boolean) => {
      updateProperty(propertyId, (draft) => {
        if (draft.meta?.type !== "number") return;
        draft.meta.integer = value;
      });
    },
    [propertyId, updateProperty],
  );

  return {
    isActive: isActive ?? false,
    handleSetIsActive,
  };
}

export function useMetaNumberIntegerToggle(): {
  isActive: boolean;
  handleToggle: () => void;
} {
  const { isActive, handleSetIsActive } = useMetaNumberInteger();

  const handleToggle = useCallback(() => {
    handleSetIsActive(!isActive);
  }, [handleSetIsActive, isActive]);

  return {
    isActive: isActive ?? false,
    handleToggle,
  };
}

/**
 * Input Hooks
 */

export function useMetaNumberMaxInput(variant?: string): {
  inputId: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
} {
  return useMetaNumberInput("max", variant);
}

export function useMetaNumberMinInput(variant?: string): {
  inputId: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
} {
  return useMetaNumberInput("min", variant);
}

function useMetaNumberInput(
  field: keyof Pick<PropertyMetaNumber, "max" | "min">,
  variant?: string,
): {
  inputId: string;
  value: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
} {
  const { t } = useCMSTranslations();

  const propertyId = usePropertyId();
  const { updateProperty } = usePropertyStoreActions();
  const value = useMetaNumberDisplay(field) || "";

  // Input ID for accessibility
  const inputId = useMemo(() => {
    return generateInputId("property-meta-number", propertyId, field.toString(), variant);
  }, [propertyId, field, variant]);

  // Placeholder text using translations
  const placeholder = useMemo(() => {
    const fieldTranslationKey = `property.meta.number.${field.toString()}.label`;
    console.log("fieldTranslationKey", fieldTranslationKey);
    return t(fieldTranslationKey);
  }, [t, field]);

  // Change handler with translation update
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value.trim();
      updateProperty(propertyId, (draft) => {
        // Preserve object reference, only update specific locale
        if (draft.meta?.type !== "number") {
          console.warn("Property meta type is not number", draft.meta);
          return;
        }
        draft.meta[field] = Number(value);
      });
    },
    [propertyId, field, updateProperty],
  );

  return {
    inputId,
    value,
    placeholder,
    onChange,
  };
}
