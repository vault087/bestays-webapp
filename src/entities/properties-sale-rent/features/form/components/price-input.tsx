import { useTranslations } from "next-intl";
import { memo } from "react";
import { FormFieldLayout, FormPriceInput } from "@/components/form";
import { usePropertyPriceInput, DBPropertyPriceField, usePropertyLocale } from "@/entities/properties-sale-rent/";
import { useDebugRender } from "@/utils/use-debug-render";

export function PropertyRentPriceInput({ className }: { className?: string }) {
  const t = useTranslations("PropertiesSaleRent.fields.rent");
  const title = t("title");

  return <PropertyPriceInput title={title} field="rent_price" className={className} />;
}
export function PropertySalePriceInput({ className }: { className?: string }) {
  const t = useTranslations("PropertiesSaleRent.fields.sale");
  const title = t("title");
  return <PropertyPriceInput title={title} field="sale_price" className={className} />;
}

export const PropertyPriceInput = memo(function PropertyPriceInput({
  title,
  field,
  className,
}: {
  title: string;
  description?: string | undefined;
  field: DBPropertyPriceField;
  className?: string;
}) {
  const { inputId, price, onPriceChange, error, currency } = usePropertyPriceInput(field);
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
      <FormPriceInput inputId={inputId} locale={locale} value={price} onChange={onPriceChange} currency={currency} />
    </FormFieldLayout>
  );
});
