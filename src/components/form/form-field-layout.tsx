import { memo } from "react";
import { FormFieldDescription } from "./form-field-description";
import { FormFieldError } from "./form-field-error";
import { FormFieldTitle } from "./form-field-title";

export const FormFieldLayout = memo(function FormFieldLayout({
  children,
  inputId,
  title,
  description,
  error,
}: {
  children: React.ReactNode;
  inputId?: string | undefined;
  title?: string | undefined;
  description?: string | undefined;
  error?: string | undefined;
}) {
  return (
    <div className="flex w-full flex-col space-y-2 bg-transparent">
      {title && <FormFieldTitle text={title} inputId={inputId} />}
      {description && <FormFieldDescription text={description} inputId={inputId} />}

      {children}

      {error && <FormFieldError error={error} inputId={inputId} className="mt-1" />}
    </div>
  );
});
