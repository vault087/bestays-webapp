"use client";

import { useTranslations } from "next-intl";
import { memo, useCallback, useMemo, useRef } from "react";
import { FormFieldLayout, FormDropDown } from "@/components/form";
import { FormFieldPreview } from "@/components/form/layout";
import { DBPropertySizeField } from "@/entities/properties-sale-rent/";
import { usePropertySizeInput } from "@/entities/properties-sale-rent/features/form/hooks/use-size-field";
import { cn, Input } from "@/modules/shadcn";
import { useDebugRender } from "@/utils/use-debug-render";

export const PropertySizeInput = function PropertySizeInput() {
  return (
    <div className="flex w-full flex-row space-x-2 bg-transparent">
      <PropertySizeTotalInput />
    </div>
  );
};

export const PropertySizeTotalInput = function PropertySizeTotalInput() {
  const t = useTranslations("Properties.fields.size");
  const title = t("title");
  const description = t("description");
  return <PropertySizeFieldInput title={title} description={description} field="total" />;
};

export const PropertySizeFieldInput = memo(function PropertySizeFieldInput({
  title,
  description,
  field,
  className,
}: {
  title: string;
  description?: string | undefined;
  field: DBPropertySizeField;
  className?: string;
}) {
  const { inputId, value, onChange, error, unit, setUnit, units } = usePropertySizeInput(field);
  useDebugRender("PropertySizeFieldInput" + field);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const formatDisplayValue = useCallback((value: string): string => {
    if (!value || value === "0") return "0.00";
    const numValue = parseFloat(value);
    return isNaN(numValue) ? "0.00" : numValue.toFixed(2);
  }, []);

  const previewValue: string = useMemo(() => {
    return (
      formatDisplayValue(value) +
      " " +
      (unit?.label ? unit.label.charAt(0).toUpperCase() + unit.label.slice(1).toLocaleLowerCase() : "")
    );
  }, [value, formatDisplayValue, unit]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const rawValue = inputValue.replace(/[^\d.]/g, ""); // Extract raw numeric value
      onChange(rawValue);
    },
    [onChange],
  );

  const handleFocus = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = value;
    }
  }, [value]);

  const handleBlur = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = formatDisplayValue(value);
    }
  }, [formatDisplayValue, value]);

  return (
    <FormFieldLayout
      title={title}
      description={description}
      error={error}
      inputId={inputId}
      className={className}
      config={{ focus_ring: true }}
    >
      <div className="flex w-full flex-col space-y-2">
        {/* Input Row */}
        <div className="flex flex-row">
          <div className="w-full rounded-md rounded-e-none border-1 border-e-0 shadow-xs">
            <Input
              id={inputId}
              ref={inputRef}
              type="text"
              defaultValue={formatDisplayValue(value)}
              placeholder="0.00"
              className={cn(
                "-me-px rounded-none border-none px-4 py-0 text-right shadow-none",
                "appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
              )}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </div>
          <FormDropDown
            selectedOption={unit}
            options={units}
            selectOption={setUnit}
            className="rounded-s-none rounded-e-md"
            isAddingOption={false}
          />
        </div>

        <FormFieldPreview previewValue={previewValue} />
      </div>
    </FormFieldLayout>
  );
});
