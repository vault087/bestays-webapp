"use client";

/**
 * @fileoverview TypeSelector - Popover type selector for property fields
 */
import { memo, useState } from "react";
import { PropertyTypeSchema, type PropertyType } from "@cms-data/modules/properties/property.types";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useType } from "@cms/modules/properties/form/hooks/use-type";

export const TypeSelector = memo(function TypeSelector() {
  const { t } = useCMSTranslations();
  const { propertyType, handleChange } = useType();
  const [open, setOpen] = useState(false);

  if (!propertyType) throw new Error("TypeSelector must be used within a valid property context");

  const handleSelect = (type: PropertyType) => {
    handleChange(type);
    setOpen(false);
  };

  return (
    <div>
      <button
        type="button"
        className="border-0 bg-transparent shadow-none"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {propertyType || t("property.type")}
      </button>
      {open && (
        <ul role="listbox" className="absolute z-10 mt-1 rounded border bg-white p-2 shadow">
          {PropertyTypeSchema.options.map((type) => (
            <li
              key={type}
              role="option"
              aria-selected={propertyType === type}
              className={`cursor-pointer rounded px-2 py-1 ${propertyType === type ? "bg-primary text-white" : ""}`}
              onClick={() => handleSelect(type)}
            >
              {t(`property.property_type.${type}`) || type}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

TypeSelector.displayName = "TypeSelector";
