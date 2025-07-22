import { memo } from "react";
import { cn } from "@/modules/shadcn/utils/cn";
import { FormFieldDescription } from "./form-field-description";
import { FormFieldError } from "./form-field-error";
import { FormFieldTitle, FormFieldTitleVariant } from "./form-field-title";

export type FormFieldLayoutConfig = {
  title?: {
    variant?: FormFieldTitleVariant | undefined;
  };
};

const DefaultFormFieldConfig: FormFieldLayoutConfig = {
  title: {
    variant: "h1",
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
  title?: string | undefined | null;
  description?: string | undefined | null;
  error?: string | undefined | null;
  config?: FormFieldLayoutConfig;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col space-y-2",
        config.title?.variant === "h1" && "rounded-lg p-4 shadow-[0_0_14px_rgba(0,0,0,0.1)]",
        className,
      )}
    >
      {title && (
        <div className="flex flex-row space-x-2">
          <FormFieldTitle text={title} inputId={inputId} variant={config.title?.variant} />
        </div>
      )}
      {description && <FormFieldDescription text={description} inputId={inputId} />}

      {children}

      {error && <FormFieldError error={error} inputId={inputId} className="mt-1" />}
    </div>
  );
});
