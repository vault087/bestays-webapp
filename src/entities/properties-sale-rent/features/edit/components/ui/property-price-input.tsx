import { ChevronDownIcon } from "lucide-react";
import { memo } from "react";
import {
  usePropertyPriceInput,
  DBPropertyPriceField,
  PropertyFieldSubHeader,
  PropertyFieldFooter,
  DBCurrency,
  PropertyFieldHeader,
} from "@/entities/properties-sale-rent/";
import { useTranslations } from "@/modules/i18n";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
} from "@/modules/shadcn";
import { useDebugRender } from "@/utils/use-debug-render";

export const PropertyPriceInput = function PropertyPriceInput() {
  const { t } = useTranslations("PropertiesSaleRent.fields.price");
  return (
    <div className="flow flow-col w-full space-y-4 bg-transparent">
      <PropertyFieldHeader text={t("label")} />
      <div className="flex flex-row space-x-4 bg-transparent">
        <PropertyPriceRaiInput />
        <PropertyPriceTotalInput />
        <PropertyPriceSaleInput />
      </div>
    </div>
  );
};

export const PropertyPriceRaiInput = function PropertyPriceRaiInput() {
  const { t } = useTranslations("PropertiesSaleRent.fields.price");
  return <PropertyPriceUncontrolledInput title={t("rai")} placeholder={t("rai")} field="rai" />;
};

export const PropertyPriceTotalInput = function PropertyPriceTotalInput() {
  const { t } = useTranslations("PropertiesSaleRent.fields.price");
  return <PropertyPriceUncontrolledInput title={t("total")} placeholder={t("total")} field="total" />;
};

export const PropertyPriceSaleInput = function PropertyPriceSaleInput() {
  const { t } = useTranslations("PropertiesSaleRent.fields.price");
  return <PropertyPriceUncontrolledInput title={t("sale")} placeholder={t("sale")} field="sale" />;
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
  const { inputId, value, onChange, error, currency, currencies, setCurrency } = usePropertyPriceInput(field);
  useDebugRender("PropertyPriceUncontrolledInput" + field);
  return (
    <div className="flex w-full flex-col bg-transparent">
      {title && <PropertyFieldSubHeader text={title} inputId={inputId} />}
      <div className="flex flex-row items-center space-x-2">
        <Input
          id={inputId}
          type="text"
          defaultValue={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-8 border-0 bg-transparent py-0 font-mono text-xs shadow-none dark:bg-transparent"
        />
        <DropDownCurrency currency={currency} currencies={currencies} onChange={setCurrency} />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {subtitle && <PropertyFieldFooter text={subtitle} inputId={inputId} />}
    </div>
  );
});

export const DropDownCurrency = memo(function DropDownCurrency({
  currency,
  currencies,
  onChange,
}: {
  currency: DBCurrency;
  currencies: DBCurrency[];
  onChange: (currency: DBCurrency) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <span className="text-muted-foreground text-xs uppercase">{currency}</span>
          <ChevronDownIcon className="-me-1 opacity-60" size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-(--radix-dropdown-menu-trigger-width)">
        {currencies.map((currency) => (
          <DropdownMenuItem key={currency} onClick={() => onChange(currency)}>
            <span className="text-muted-foreground text-xs uppercase">{currency}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
