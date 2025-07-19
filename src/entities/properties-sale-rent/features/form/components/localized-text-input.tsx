import { useTranslations } from "next-intl";
import { ChangeEvent, memo } from "react";
import {
  DBPropertyLocalizedTextField,
  PROPERTY_ABOUT_MAX,
  PropertyFieldFooter,
  PropertyFieldHeader,
  usePropertyLocalizedTextInput,
} from "@/entities/properties-sale-rent/";
import { Textarea } from "@/modules/shadcn";
import { useDebugRender } from "@/utils/use-debug-render";

// Localized Text Uncontrolled Input
export const PropertyAboutInput = function PropertyAboutInput() {
  const t = useTranslations("PropertiesSaleRent.fields.about");
  return (
    <PropertyLocalizedTextInput
      title={t("label")}
      placeholder={t("placeholder")}
      subtitle={t("subtitle")}
      field="about"
      maxLength={PROPERTY_ABOUT_MAX}
    />
  );
};

export const PropertyLocalizedTextInput = memo(function PropertyLocalizedTextInput({
  title,
  subtitle,
  maxLength,
  placeholder,
  field,
}: {
  title: string | undefined;
  placeholder: string | undefined;
  subtitle: string | undefined;
  maxLength: number;
  field: DBPropertyLocalizedTextField;
}) {
  const { inputId, value, onChange, error, characterCount } = usePropertyLocalizedTextInput(field, maxLength);
  const onTextAreaChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    onChange(e.target.value);
  };

  useDebugRender("LocalizedTextUncontrolledInput" + title);

  return (
    <div className="flex w-full flex-col bg-transparent">
      {title && <PropertyFieldHeader text={title} inputId={inputId} />}

      <Textarea
        id={inputId}
        value={value}
        maxLength={maxLength}
        onChange={onTextAreaChange}
        placeholder={placeholder || ""}
        aria-describedby={`${inputId}-description`}
      />
      <p
        id={`${inputId}-description`}
        className="text-muted-foreground mt-2 text-right text-xs"
        role="status"
        aria-live="polite"
      >
        <span className="tabular-nums">{maxLength - characterCount}</span> characters left
      </p>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {subtitle && <PropertyFieldFooter text={subtitle} inputId={inputId} />}
    </div>
  );
});
