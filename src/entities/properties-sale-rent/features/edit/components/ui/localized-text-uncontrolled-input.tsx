import { useTranslations } from "next-intl";
import { memo } from "react";
import { DBPropertyLocalizedTextField } from "@/entities/properties-sale-rent/core/types/property.types";
import { usePropertyLocalizedTextInput } from "@/entities/properties-sale-rent/features/edit/components";
import { Input } from "@/modules/shadcn";
import { useDebugRender } from "@/utils/use-debug-render";

export const PropertyTitleUncontrolledInput = memo(function PropertyTitleUncontrolledInput({
  locale,
}: {
  locale: string;
}) {
  const t = useTranslations("PropertiesSaleRent.fields");
  const title = t("title.label");
  const subtitle = t("title.subtitle");
  const placeholder = t("title.placeholder");
  return (
    <PropertyLocalizedTextUncontrolledInput
      title={title}
      placeholder={placeholder}
      subtitle={subtitle}
      locale={locale}
      field="title"
    />
  );
});

export const PropertyDescriptionUncontrolledInput = memo(function PropertyDescriptionUncontrolledInput({
  locale,
}: {
  locale: string;
}) {
  const t = useTranslations("PropertiesSaleRent.fields");
  const title = t("description.label");
  const placeholder = t("description.placeholder");
  const subtitle = t("description.subtitle");
  return (
    <PropertyLocalizedTextUncontrolledInput
      title={title}
      placeholder={placeholder}
      subtitle={subtitle}
      locale={locale}
      field="description"
    />
  );
});

export const PropertyLocalizedTextUncontrolledInput = memo(function PropertyLocalizedTextUncontrolledInput({
  title,
  placeholder,
  subtitle,
  locale,
  field,
}: {
  title: string;
  placeholder: string;
  subtitle: string;
  locale: string;
  field: DBPropertyLocalizedTextField;
}) {
  const { inputId, value, onChange, error } = usePropertyLocalizedTextInput(locale, field);
  useDebugRender("LocalizedTextUncontrolledInput" + title);
  return (
    <div className="flex w-full flex-col bg-transparent">
      <span className="font-open-sans text-md items-center border-0">{title}</span>
      <Input
        id={inputId}
        type="text"
        defaultValue={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 border-0 bg-transparent py-0 font-mono text-xs shadow-none dark:bg-transparent"
      />
      <p className="text-muted-foreground text-xs">{subtitle}</p>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});
