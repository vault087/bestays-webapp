import { ChevronDownIcon } from "lucide-react";
import { memo } from "react";
import { DBSerialID } from "@/entities/common/";
import { PropertyFieldHeader, PropertyFieldFooter, DBPropertySizeField } from "@/entities/properties-sale-rent/";
import {
  SizeUnitOption,
  usePropertySizeInput,
} from "@/entities/properties-sale-rent/features/form/hooks/use-size-field";
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

export const PropertySizeInput = function PropertySizeInput() {
  return (
    <div className="flex w-full flex-row space-x-2 bg-transparent">
      <PropertySizeTotalInput />
    </div>
  );
};

export const PropertySizeTotalInput = function PropertySizeTotalInput() {
  const { t } = useTranslations("PropertiesSaleRent.fields.size");
  return <PropertySizeUncontrolledInput title={t("label")} placeholder={t("label")} field="total" />;
};

export const PropertySizeUncontrolledInput = memo(function PropertySizeUncontrolledInput({
  title,
  subtitle,
  placeholder,
  field,
}: {
  title: string;
  subtitle?: string | undefined;
  placeholder?: string | undefined;
  field: DBPropertySizeField;
}) {
  const { inputId, value, onChange, error, unit, setUnit, options } = usePropertySizeInput(field);
  useDebugRender("PropertySizeUncontrolledInput" + field);
  return (
    <div className="flex w-full flex-col bg-transparent">
      {title && <PropertyFieldHeader text={title} inputId={inputId} />}
      <div className="flex flex-row items-center space-x-2">
        <Input
          id={inputId}
          type="text"
          defaultValue={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-8 border-0 bg-transparent py-0 font-mono text-xs shadow-none dark:bg-transparent"
        />
        <DropDownUnit unit={unit} units={options} onChange={setUnit} />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {subtitle && <PropertyFieldFooter text={subtitle} inputId={inputId} />}
    </div>
  );
});

export const DropDownUnit = memo(function DropDownUnit({
  unit,
  units,
  onChange,
}: {
  unit: SizeUnitOption;
  units: SizeUnitOption[];
  onChange: (unit: DBSerialID) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <span className="text-muted-foreground text-xs uppercase">{unit.label}</span>
          <ChevronDownIcon className="-me-1 opacity-60" size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-(--radix-dropdown-menu-trigger-width)">
        {units.map((unit) => (
          <DropdownMenuItem key={unit.key} onClick={() => onChange(unit.key)}>
            <span className="text-muted-foreground text-xs uppercase">{unit.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
