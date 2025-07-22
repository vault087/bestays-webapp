"use client";

import { memo } from "react";
import { FormFieldLayout, FormDropDown } from "@/components/form";
import { DBPropertySizeField } from "@/entities/properties-sale-rent/";
import { usePropertySizeInput } from "@/entities/properties-sale-rent/features/form/hooks/use-size-field";
import { useTranslations } from "@/modules/i18n";
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
  const { t } = useTranslations("PropertiesSaleRent.fields.size");
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
  return (
    <FormFieldLayout title={title} description={description} error={error} inputId={inputId} className={className}>
      <div className="flex flex-row items-center space-x-2">
        <div className="flex w-full flex-col space-y-0">
          <Input
            id={inputId}
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0.00"
            className={cn(
              "h-8 border-0 bg-transparent px-1 py-0 text-left font-mono text-xs shadow-none dark:bg-transparent",
              "appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            )}
          />
          <div className="bg-border h-[1px] w-full" />
        </div>
        <FormDropDown selectedOption={unit} options={units} selectOption={setUnit} />
      </div>
    </FormFieldLayout>
  );
});
