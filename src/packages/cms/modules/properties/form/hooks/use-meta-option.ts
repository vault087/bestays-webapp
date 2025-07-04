import { useCallback } from "react";
import { PropertyOptionSorting } from "@cms-data/modules/properties/property.types";
import { useProperty, usePropertyId, usePropertyStoreActions } from "@cms/modules/properties/form";

export const useMetaOptionMulti = (): {
  isActive: boolean;
  handleSetIsActive: (value: boolean) => void;
} => {
  const propertyId = usePropertyId();
  const { updateProperty } = usePropertyStoreActions();
  const isActive = useProperty((p) => p.meta?.type === "option" && p.meta.multi);

  const handleSetIsActive = useCallback(
    (value: boolean) => {
      updateProperty(propertyId, (draft) => {
        if (draft.meta?.type !== "option") return;
        draft.meta.multi = value;
      });
    },
    [propertyId, updateProperty],
  );

  return {
    isActive: isActive ?? false,
    handleSetIsActive,
  };
};

export const useMetaOptionMultiToggle = (): {
  isActive: boolean;
  handleToggle: () => void;
} => {
  const { isActive, handleSetIsActive } = useMetaOptionMulti();

  const handleToggle = useCallback(() => {
    handleSetIsActive(!isActive);
  }, [handleSetIsActive, isActive]);

  return {
    isActive: isActive ?? false,
    handleToggle,
  };
};

export const useMetaOptionSorting = (): {
  value: PropertyOptionSorting;
  setValue: (value: PropertyOptionSorting) => void;
} => {
  const propertyId = usePropertyId();
  const { updateProperty } = usePropertyStoreActions();
  const value = useProperty((p) => {
    if (p.meta?.type !== "option") return "manual";
    return p.meta.sorting;
  });

  const setValue = useCallback(
    (value: PropertyOptionSorting) => {
      updateProperty(propertyId, (draft) => {
        if (draft.meta?.type !== "option") return;
        draft.meta.sorting = value;
      });
    },
    [propertyId, updateProperty],
  );

  return {
    value: value ?? "alphabet",
    setValue,
  };
};
