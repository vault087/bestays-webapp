import { useTranslations } from "next-intl";
import { memo } from "react";
import {
  DBPropertyLocalizedTextField,
  PropertyFieldFooter,
  PropertyFieldHeader,
  usePropertyLocalizedTextInput,
} from "@/entities/properties-sale-rent/";
import { Input } from "@/modules/shadcn";
import { useDebugRender } from "@/utils/use-debug-render";

export const PropertyAboutUncontrolledInput = memo(function PropertyAboutUncontrolledInput() {
  const t = useTranslations("PropertiesSaleRent.fields");
  const title = t("about.label");
  const placeholder = t("about.placeholder");
  const subtitle = t("about.subtitle");
  return (
    <PropertyLocalizedTextUncontrolledInput title={title} placeholder={placeholder} subtitle={subtitle} field="about" />
  );
});

export const PropertyLocalizedTextUncontrolledInput = memo(function PropertyLocalizedTextUncontrolledInput({
  title,
  placeholder,
  subtitle,
  field,
}: {
  title: string;
  placeholder: string;
  subtitle: string;
  field: DBPropertyLocalizedTextField;
}) {
  const { inputId, value, onChange, error } = usePropertyLocalizedTextInput(field);
  useDebugRender("LocalizedTextUncontrolledInput" + title);
  return (
    <div className="flex w-full flex-col bg-transparent">
      <PropertyFieldHeader text={title} inputId={inputId} />
      <Input
        id={inputId}
        type="text"
        defaultValue={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 border-0 bg-transparent py-0 font-mono text-xs shadow-none dark:bg-transparent"
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      <PropertyFieldFooter text={subtitle} inputId={inputId} />
    </div>
  );
});
