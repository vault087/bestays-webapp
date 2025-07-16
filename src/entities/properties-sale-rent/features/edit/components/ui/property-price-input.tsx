import { memo } from "react";
import {
  usePropertyPriceInput,
  DBPropertyPriceField,
  PropertyFieldHeader,
  PropertyFieldFooter,
} from "@/entities/properties-sale-rent/";
import { Input, Label } from "@/modules/shadcn";
import { useDebugRender } from "@/utils/use-debug-render";

export const PropertyPriceInput = function PropertyPriceInput() {
  return (
    <div className="flex w-full flex-row space-x-2 bg-transparent">
      <PropertyPriceRaiInput />
      <PropertyPriceTotalInput />
      <PropertyPriceSaleInput />
    </div>
  );
};

export const PropertyPriceRaiInput = function PropertyPriceRaiInput() {
  return <PropertyPriceUncontrolledInput title="Rai" placeholder="Price" field="rai" />;
};

export const PropertyPriceTotalInput = function PropertyPriceTotalInput() {
  return <PropertyPriceUncontrolledInput title="Total" placeholder="Price" field="total" />;
};

export const PropertyPriceSaleInput = function PropertyPriceSaleInput() {
  return <PropertyPriceUncontrolledInput title="Sale" placeholder="Price" field="sale" />;
};

export const PropertyPriceUncontrolledInput = memo(function PropertyPriceUncontrolledInput({
  title,
  subtitle,
  placeholder,
  field,
}: {
  title: string;
  subtitle?: string | undefined;
  placeholder?: string | undefined;
  field: DBPropertyPriceField;
}) {
  const { inputId, value, onChange, error, currency } = usePropertyPriceInput(field);
  useDebugRender("PropertyPriceUncontrolledInput" + field);
  return (
    <div className="flex w-full flex-col bg-transparent">
      {title && <PropertyFieldHeader text={title} inputId={inputId} />}
      <div className="flex flex-row items-center space-x-2">
        {currency && (
          <Label htmlFor={inputId} className="text-muted-foreground text-xs uppercase">
            {currency}
          </Label>
        )}
        <Input
          id={inputId}
          type="text"
          defaultValue={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-8 border-0 bg-transparent py-0 font-mono text-xs shadow-none dark:bg-transparent"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {subtitle && <PropertyFieldFooter text={subtitle} inputId={inputId} />}
    </div>
  );
});
