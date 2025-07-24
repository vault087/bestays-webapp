"use client";

import { useTranslations } from "next-intl";
import { memo, useState } from "react";
import { FormFieldLayout, FormPriceInput } from "@/components/form";
import { FormFieldLayoutToolbar } from "@/components/form/layout/form-field-layout-toolbar";
import {
  usePropertyPriceInput,
  DBPropertyPriceField,
  usePropertyLocale,
  DBPropertyBoolField,
} from "@/entities/properties-sale-rent/";
import { usePropertyBoolInput } from "@/entities/properties-sale-rent/features/form/hooks/use-bool-field";
import { Switch } from "@/modules/shadcn/components/ui/switch";
import { useDebugRender } from "@/utils/use-debug-render";

export function PropertyRentPriceInput({ className }: { className?: string }) {
  const t = useTranslations("PropertiesSaleRent.fields.rent");
  const title = t("title");

  return <PropertyPriceInput title={title} field="rent_price" toggleField="rent_enabled" className={className} />;
}
export function PropertySalePriceInput({ className }: { className?: string }) {
  const t = useTranslations("PropertiesSaleRent.fields.sale");
  const title = t("title");
  return <PropertyPriceInput title={title} field="sale_price" toggleField="sale_enabled" className={className} />;
}

export const PropertyPriceInput = memo(function PropertyPriceInput({
  title,
  field,
  toggleField,
  className,
}: {
  title: string;
  description?: string | undefined;
  field: DBPropertyPriceField;
  toggleField: DBPropertyBoolField;
  className?: string;
}) {
  const { inputId, price, onPriceChange, error, currency } = usePropertyPriceInput(field);
  const { value: toggleValue, onChange: onToggleChange } = usePropertyBoolInput(toggleField);
  useDebugRender("PropertyPriceInput" + field);
  const locale = usePropertyLocale();

  return (
    <FormFieldLayout
      title={title}
      inputId={inputId}
      error={error}
      className={className}
      config={{
        title: {
          variant: "h1",
        },
        focus_ring: false,
      }}
    >
      <FormFieldLayoutToolbar className="pt-1 opacity-100">
        <div className="flex flex-row items-center gap-2">
          <Switch
            checked={toggleValue}
            onCheckedChange={onToggleChange}
            id={`${inputId}-toggle`}
            className="data-[state=unchecked]:border-input data-[state=unchecked]:[&_span]:bg-input data-[state=unchecked]:bg-transparent [&_span]:transition-all data-[state=unchecked]:[&_span]:size-4 data-[state=unchecked]:[&_span]:translate-x-0.5 data-[state=unchecked]:[&_span]:shadow-none data-[state=unchecked]:[&_span]:rtl:-translate-x-0.5"
          />
        </div>
      </FormFieldLayoutToolbar>
      <FormPriceInput inputId={inputId} locale={locale} value={price} onChange={onPriceChange} currency={currency} />
    </FormFieldLayout>
  );
});
