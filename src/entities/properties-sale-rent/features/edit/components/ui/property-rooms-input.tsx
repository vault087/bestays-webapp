import { ChevronDownIcon } from "lucide-react";
import { memo } from "react";
import {
  PropertyFieldSubHeader,
  PropertyFieldFooter,
  DBCurrency,
  PropertyFieldHeader,
  DBPropertyRoomsField,
} from "@/entities/properties-sale-rent/";
import { usePropertyRoomsInput } from "@/entities/properties-sale-rent/features/edit/components/hooks/use-rooms-field";
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

export const PropertyRoomsInput = function PropertyRoomsInput() {
  const { t } = useTranslations("PropertiesSaleRent.fields.rooms");
  return (
    <div className="flow flow-col w-full space-y-4 bg-transparent">
      <PropertyFieldHeader text={t("label")} />
      <div className="flex flex-row space-x-4 bg-transparent">
        <PropertyRoomsBedroomsInput />
        <PropertyRoomsBathroomsInput />
        <PropertyRoomsLivingRoomsInput />
      </div>
    </div>
  );
};

export const PropertyRoomsBedroomsInput = function PropertyRoomsBedroomsInput() {
  const { t } = useTranslations("PropertiesSaleRent.fields.rooms");
  return <PropertyRoomsUncontrolledInput title={t("bedrooms")} placeholder={t("bedrooms")} field="bedrooms" />;
};

export const PropertyRoomsBathroomsInput = function PropertyRoomsBathroomsInput() {
  const { t } = useTranslations("PropertiesSaleRent.fields.rooms");
  return <PropertyRoomsUncontrolledInput title={t("bathrooms")} placeholder={t("bathrooms")} field="bathrooms" />;
};

export const PropertyRoomsLivingRoomsInput = function PropertyRoomsLivingRoomsInput() {
  const { t } = useTranslations("PropertiesSaleRent.fields.rooms");
  return (
    <PropertyRoomsUncontrolledInput title={t("living_rooms")} placeholder={t("living_rooms")} field="living_rooms" />
  );
};

export const PropertyRoomsUncontrolledInput = memo(function PropertyRoomsUncontrolledInput({
  title,
  subtitle,
  placeholder,
  field,
}: {
  title: string;
  subtitle?: string | undefined;
  placeholder?: string | undefined;
  field: DBPropertyRoomsField;
}) {
  const { inputId, value, onChange, error } = usePropertyRoomsInput(field);
  useDebugRender("PropertyRoomsUncontrolledInput" + field);
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
