"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { memo, useCallback } from "react";
import { FormFieldLayout } from "@/components/form";
import { DBPropertyRoomsField } from "@/entities/properties-sale-rent/";
import { usePropertyRoomsInput } from "@/entities/properties-sale-rent/features/form/hooks/use-rooms-field";
import { useTranslations } from "@/modules/i18n";
import { Button, Input, cn } from "@/modules/shadcn";
import { useDebugRender } from "@/utils/use-debug-render";

export const PropertyRoomsInputGroup = function PropertyRoomsInputGroup({
  direction = "vertical",
  className,
}: {
  direction?: "vertical" | "horizontal";
  className?: string;
}) {
  const { t } = useTranslations("PropertiesSaleRent.fields.rooms");
  const title = t("title");
  const description = t("description");
  return (
    <FormFieldLayout title={title} description={description} className={className} config={{ focus_ring: true }}>
      <div className={cn(direction === "vertical" ? "flex flex-col gap-4" : "flex flex-row gap-4")}>
        <PropertyRoomsBedroomsInput />
        <PropertyRoomsBathroomsInput />
        <PropertyRoomsLivingRoomsInput />
      </div>
    </FormFieldLayout>
  );
};

export const PropertyRoomsBedroomsInput = function PropertyRoomsBedroomsInput() {
  const { t } = useTranslations("PropertiesSaleRent.fields.rooms");
  return <PropertyRoomsFieldInput title={t("bedrooms")} field="bedrooms" />;
};

export const PropertyRoomsBathroomsInput = function PropertyRoomsBathroomsInput() {
  const { t } = useTranslations("PropertiesSaleRent.fields.rooms");
  return <PropertyRoomsFieldInput title={t("bathrooms")} field="bathrooms" />;
};

export const PropertyRoomsLivingRoomsInput = function PropertyRoomsLivingRoomsInput() {
  const { t } = useTranslations("PropertiesSaleRent.fields.rooms");
  return <PropertyRoomsFieldInput title={t("living_rooms")} field="living_rooms" />;
};

export const PropertyRoomsFieldInput = memo(function PropertyRoomsFieldInput({
  title,
  description,
  field,
  className,
}: {
  title: string;
  description?: string | undefined;
  field: DBPropertyRoomsField;
  className?: string;
}) {
  const { inputId, value, onChange, error, onIncrement, onDecrement } = usePropertyRoomsInput(field);
  useDebugRender("PropertyRoomsFieldInput" + field);

  const formatDisplayValue = useCallback((value: string): string => {
    if (!value || value === "0") return "0";
    const numValue = parseInt(value);
    return isNaN(numValue) ? "0" : numValue.toString();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const rawValue = inputValue.replace(/[^\d]/g, ""); // Extract only digits
      onChange(rawValue);
    },
    [onChange],
  );

  return (
    <FormFieldLayout
      title={title}
      description={description}
      error={error}
      inputId={inputId}
      className={cn("flex flex-row items-center justify-between", className)}
      config={{
        title: {
          variant: "h2",
        },
      }}
    >
      <div className="focus-within:text-primary flex flex-row items-center justify-end space-x-0">
        <Button variant="outline" size="icon" className="rounded-full" onClick={onDecrement}>
          <MinusIcon className="h-4 w-4" />
        </Button>
        <div className="flex w-10 justify-center">
          <Input
            id={inputId}
            type="text"
            value={formatDisplayValue(value)}
            placeholder="0"
            maxLength={3}
            className="h-8 w-auto min-w-0 border-0 px-1 py-0 text-center font-mono text-xs shadow-none dark:bg-transparent"
            onChange={handleChange}
          />
        </div>
        <Button variant="outline" size="icon" className="rounded-full" onClick={onIncrement}>
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
    </FormFieldLayout>
  );
});
