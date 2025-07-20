import { useTranslations } from "next-intl";
import { ChangeEvent, memo } from "react";
import { FormFieldLayout } from "@/components/form/layout/form-field-layout";
import {
  DBPropertyLocalizedTextField,
  PROPERTY_ABOUT_MAX,
  usePropertyLocalizedTextInput,
} from "@/entities/properties-sale-rent/";
import { Textarea } from "@/modules/shadcn";
import { useDebugRender } from "@/utils/use-debug-render";

// Localized Text Uncontrolled Input
export const PropertyAboutInput = function PropertyAboutInput() {
  const t = useTranslations("PropertiesSaleRent.fields.about");
  return (
    <PropertyLocalizedTextInput
      title={t("title")}
      placeholder={t("placeholder")}
      description={t("description")}
      field="about"
      maxLength={PROPERTY_ABOUT_MAX}
    />
  );
};

export const PropertyLocalizedTextInput = memo(function PropertyLocalizedTextInput({
  title,
  description,
  maxLength,
  placeholder,
  field,
}: {
  title: string | undefined;
  placeholder: string | undefined;
  description: string | undefined;
  maxLength: number;
  field: DBPropertyLocalizedTextField;
}) {
  const { inputId, value, onChange, error, characterCount } = usePropertyLocalizedTextInput(field, maxLength);
  const onTextAreaChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    onChange(e.target.value);
  };

  useDebugRender("PropertyLocalizedTextInput" + title);

  return (
    <FormFieldLayout title={title} description={description} error={error} inputId={inputId}>
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
    </FormFieldLayout>
  );
});
