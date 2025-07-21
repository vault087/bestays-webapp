import { memo, useId } from "react";
import { FormFieldLayout, FormPriceInput } from "@/components/form";
import { usePropertyPriceInput, DBPropertyPriceField } from "@/entities/properties-sale-rent/";
import { useTranslations } from "@/modules/i18n";
import { cn } from "@/modules/shadcn";
import { useDebugRender } from "@/utils/use-debug-render";

export const PropertyPriceInputGroup = function PropertyPriceInputGroup({
  direction = "vertical",
  className,
}: {
  direction?: "vertical" | "horizontal";
  className?: string;
}) {
  const { t } = useTranslations("PropertiesSaleRent.fields.price");
  const inputId = useId();
  const title = t("title");
  return (
    <FormFieldLayout title={title} inputId={inputId} className={className}>
      <div className={cn(direction === "vertical" ? "flex flex-col gap-2" : "flex flex-row gap-2")}>
        <PropertyPriceRaiInput />
        <PropertyPriceTotalInput />
        <PropertyPriceSaleInput />
      </div>
    </FormFieldLayout>
  );
};

export const PropertyPriceRaiInput = function PropertyPriceRaiInput() {
  const { t } = useTranslations("PropertiesSaleRent.fields.price");
  return <PropertyPriceInput title={t("rai.title")} field="rai" />;
};

export const PropertyPriceTotalInput = function PropertyPriceTotalInput() {
  const { t } = useTranslations("PropertiesSaleRent.fields.price");
  return <PropertyPriceInput title={t("total.title")} field="total" />;
};

export const PropertyPriceSaleInput = function PropertyPriceSaleInput() {
  const { t } = useTranslations("PropertiesSaleRent.fields.price");
  return <PropertyPriceInput title={t("sale.title")} field="sale" />;
};

export const PropertyPriceInput = memo(function PropertyPriceInput({
  title,
  field,
  className,
}: {
  title: string;
  subtitle?: string | undefined;
  field: DBPropertyPriceField;
  className?: string;
}) {
  const { inputId, value, onChange, error, currency, currencies, setCurrency } = usePropertyPriceInput(field);
  useDebugRender("PropertyPriceInput" + field);

  return (
    <FormFieldLayout
      title={title}
      inputId={inputId}
      error={error}
      className={className}
      config={{
        title: {
          variant: "h2",
        },
      }}
    >
      <FormPriceInput
        inputId={inputId}
        value={value}
        onChange={onChange}
        currency={currency}
        currencies={currencies}
        onCurrencyChange={setCurrency}
      />
    </FormFieldLayout>
  );
});
