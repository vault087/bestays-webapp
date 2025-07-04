"use client";

import { useMemo, useCallback } from "react";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { usePropertyId, useProperty, usePropertyStoreActions } from "@cms/modules/properties/form";
import { generateInputId } from "@cms/modules/shared/form/utils/input-id.utils";

export function useMetaTextMaxDisplay(): string | undefined {
  return useProperty((property) => {
    if (property.meta?.type !== "text") return undefined;
    return property.meta.max?.toString() || undefined;
  });
}

export const useMetaTextMultilineToggle = (): {
  isActive: boolean;
  handleToggle: () => void;
} => {
  const propertyId = usePropertyId();
  const { updateProperty } = usePropertyStoreActions();
  const isActive = useProperty((p) => p.meta?.type === "text" && p.meta.multiline);

  const handleToggle = useCallback(() => {
    updateProperty(propertyId, (draft) => {
      if (draft.meta?.type !== "text") return;
      draft.meta.multiline = !draft.meta.multiline;
    });
  }, [propertyId, updateProperty]);

  return {
    isActive: isActive ?? false,
    handleToggle,
  };
};

export function useMetaTextMaxInput(variant?: string): {
  inputId: string;
  value: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
} {
  const { t } = useCMSTranslations();

  const propertyId = usePropertyId();
  const { updateProperty } = usePropertyStoreActions();
  const value = useMetaTextMaxDisplay() || "";

  // Input ID for accessibility
  const inputId = useMemo(() => {
    return generateInputId("property-meta-text", propertyId, "max", variant);
  }, [propertyId, variant]);

  // Placeholder text using translations
  const placeholder = useMemo(() => {
    const fieldTranslationKey = `property.meta.text.max.label`;
    return t(fieldTranslationKey);
  }, [t]);

  // Change handler with translation update
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value.trim();
      updateProperty(propertyId, (draft) => {
        // Preserve object reference, only update specific locale
        if (draft.meta?.type !== "text") {
          console.warn("Property meta type is not text", draft.meta);
          return;
        }
        draft.meta.max = Number(value);
      });
    },
    [updateProperty, propertyId],
  );

  return {
    inputId,
    value,
    placeholder,
    onChange,
  };
}
