import { memo, useId } from "react";
import { FormFieldLayout, FormPriceInput } from "@/components/form";
import { usePropertyPriceInput, DBPropertyPriceField } from "@/entities/properties-sale-rent/";
import { useTranslations } from "@/modules/i18n";
import { cn } from "@/modules/shadcn";
import { useDebugRender } from "@/utils/use-debug-render";

export const PropertyPriceInputGroup = function PropertyPriceInputGroup({ className }: { className?: string }) {
  const { t } = useTranslations("PropertiesSaleRent.fields.price");
  const inputId = useId();
  const title = t("title");
  return (
    <FormFieldLayout title={title} inputId={inputId} className={cn("flex flex-row gap-2", className)}>
      <PropertyPriceRaiInput />
      <PropertyPriceTotalInput />
      <PropertyPriceSaleInput />
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
