import { MinusIcon, PlusIcon } from "lucide-react";
import { memo } from "react";
import {
  PropertyFieldSubHeader,
  PropertyFieldFooter,
  PropertyFieldHeader,
  DBPropertyRoomsField,
} from "@/entities/properties-sale-rent/";
import { usePropertyRoomsInput } from "@/entities/properties-sale-rent/features/form/hooks/use-rooms-field";
import { useTranslations } from "@/modules/i18n";
import { Button, Input } from "@/modules/shadcn";
import { useDebugRender } from "@/utils/use-debug-render";

export const PropertyRoomsInput = function PropertyRoomsInput() {
  const { t } = useTranslations("PropertiesSaleRent.fields.rooms");
  return (
    <div className="flow flow-col w-full space-y-4 bg-transparent">
      <PropertyFieldHeader text={t("label")} />
      <div className="flex flex-col gap-4 bg-transparent">
        <PropertyRoomsBedroomsInput />
        <PropertyRoomsBathroomsInput />
        <PropertyRoomsLivingRoomsInput />
      </div>
    </div>
  );
};

export const PropertyRoomsBedroomsInput = function PropertyRoomsBedroomsInput() {
  const { t } = useTranslations("PropertiesSaleRent.fields.rooms");
  return <PropertyRoomsUncontrolledInput title={t("bedrooms")} placeholder="0" field="bedrooms" />;
};

export const PropertyRoomsBathroomsInput = function PropertyRoomsBathroomsInput() {
  const { t } = useTranslations("PropertiesSaleRent.fields.rooms");
  return <PropertyRoomsUncontrolledInput title={t("bathrooms")} placeholder="0" field="bathrooms" />;
};

export const PropertyRoomsLivingRoomsInput = function PropertyRoomsLivingRoomsInput() {
  const { t } = useTranslations("PropertiesSaleRent.fields.rooms");
  return <PropertyRoomsUncontrolledInput title={t("living_rooms")} placeholder="0" field="living_rooms" />;
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
  const { inputId, value, onChange, error, onIncrement, onDecrement } = usePropertyRoomsInput(field);
  useDebugRender("PropertyRoomsUncontrolledInput" + field);
  return (
    <div className="flex w-full flex-col bg-transparent">
      <div className="flex w-full flex-row items-center justify-between space-x-2">
        {title && <PropertyFieldSubHeader text={title} inputId={inputId} />}
        <div className="flex w-full flex-row items-center justify-end space-x-0">
          <Button variant="outline" size="icon" className="rounded-full" onClick={onDecrement}>
            <MinusIcon className="h-4 w-4" />
          </Button>
          <Input
            id={inputId}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="h-8 w-10 p-2 py-0 text-right font-mono text-xs shadow-none placeholder:text-sm dark:bg-transparent"
          />

          <Button variant="outline" size="icon" className="rounded-full" onClick={onIncrement}>
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {subtitle && <PropertyFieldFooter text={subtitle} inputId={inputId} />}
    </div>
  );
});
