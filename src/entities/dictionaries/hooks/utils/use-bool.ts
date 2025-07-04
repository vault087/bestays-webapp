"use client";

import { useCallback } from "react";
import { usePropertyId, useProperty, usePropertyStoreActions } from "@cms/modules/properties/form";
import type { FormProperty } from "@cms/modules/properties/form/types";

export const useBoolToggle = (
  propertyKey: keyof Pick<FormProperty, "is_locked" | "is_private" | "is_required">,
): {
  isActive: boolean;
  handleToggle: () => void;
} => {
  const propertyId = usePropertyId();
  const { updateProperty } = usePropertyStoreActions();
  const isActive = useProperty((p) => p[propertyKey]) ?? false;

  const handleToggle = useCallback(() => {
    updateProperty(propertyId, (draft: FormProperty) => {
      draft[propertyKey] = !draft[propertyKey];
    });
  }, [propertyId, propertyKey, updateProperty]);

  return {
    isActive,
    handleToggle,
  };
};
