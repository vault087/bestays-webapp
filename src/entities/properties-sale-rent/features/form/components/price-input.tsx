import { memo, useId } from "react";
import { FormFieldLayout, FormPriceInput, FormFieldLayoutConfig } from "@/components/form";
import { usePropertyPriceInput, DBPropertyPriceField } from "@/entities/properties-sale-rent/";
import { useTranslations } from "@/modules/i18n";
import { useDebugRender } from "@/utils/use-debug-render";

export const PropertyPriceInputGroup = function PropertyPriceInputGroup() {
  const { t } = useTranslations("PropertiesSaleRent.fields.price");
  const inputId = useId();
  const title = t("title");
  return (
    <FormFieldLayout title={title} inputId={inputId}>
      <div className="flex flex-col gap-4">
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
}: {
  title: string;
  subtitle?: string | undefined;
  field: DBPropertyPriceField;
}) {
  const { inputId, value, onChange, error, currency, currencies, setCurrency } = usePropertyPriceInput(field);
  useDebugRender("PropertyPriceInput" + field);

  return (
    <FormFieldLayout
      title={title}
      inputId={inputId}
      error={error}
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
