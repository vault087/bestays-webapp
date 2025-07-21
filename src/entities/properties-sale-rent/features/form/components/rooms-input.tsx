"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { memo, useId } from "react";
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
  const inputId = useId();
  const title = t("title");
  return (
    <FormFieldLayout title={title} inputId={inputId} className={className}>
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
  subtitle,
  field,
  className,
}: {
  title: string;
  subtitle?: string | undefined;
  field: DBPropertyRoomsField;
  className?: string;
}) {
  const { inputId, value, onChange, error, onIncrement, onDecrement } = usePropertyRoomsInput(field);
  useDebugRender("PropertyRoomsFieldInput" + field);

  return (
    <FormFieldLayout
      title={title}
      description={subtitle}
      error={error}
      inputId={inputId}
      className={className}
      config={{
        title: {
          variant: "h2",
        },
      }}
    >
      <div className="flex flex-row items-center justify-end space-x-0">
        <Button variant="outline" size="icon" className="rounded-full" onClick={onDecrement}>
          <MinusIcon className="h-4 w-4" />
        </Button>
        <Input
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="h-8 w-16 p-2 py-0 text-center font-mono text-xs shadow-none dark:bg-transparent"
        />
        <Button variant="outline" size="icon" className="rounded-full" onClick={onIncrement}>
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
    </FormFieldLayout>
  );
});
