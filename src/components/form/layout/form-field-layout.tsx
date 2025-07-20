import { memo } from "react";
import { cn } from "@/modules/shadcn/utils/cn";
import { FormFieldDescription } from "./form-field-description";
import { FormFieldError } from "./form-field-error";
import { FormFieldTitle } from "./form-field-title";

export type FormFieldLayoutConfig = {
  title: {
    variant: "bold" | "normal";
  };
};

const DefaultFormFieldConfig: FormFieldLayoutConfig = {
  title: {
    variant: "bold",
  },
};

export const FormFieldLayout = memo(function FormFieldLayout({
  children,
  inputId,
  title,
  description,
  error,
  config = DefaultFormFieldConfig,
  className,
}: {
  children: React.ReactNode;
  inputId?: string | undefined;
  title?: string | undefined;
  description?: string | undefined;
  error?: string | undefined;
  config?: FormFieldLayoutConfig;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {title && <FormFieldTitle text={title} inputId={inputId} variant={config.title?.variant} />}
      {description && <FormFieldDescription text={description} inputId={inputId} />}

      {children}

      {error && <FormFieldError error={error} inputId={inputId} className="mt-1" />}
    </div>
  );
});
