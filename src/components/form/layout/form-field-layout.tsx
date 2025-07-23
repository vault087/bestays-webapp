"use client";

import { memo, useState } from "react";
import { cn } from "@/modules/shadcn/utils/cn";
import { FormFieldDescription } from "./form-field-description";
import { FormFieldError } from "./form-field-error";
import { FormFieldLayoutProvider } from "./form-field-layout.context";
import { FormFieldTitle, FormFieldTitleVariant } from "./form-field-title";

export type FormFieldLayoutConfig = {
  title?: {
    variant?: FormFieldTitleVariant | undefined;
  };
  description?: {
    position?: "top" | "bottom";
  };
  focus_ring?: boolean;
};

const DefaultFormFieldConfig: FormFieldLayoutConfig = {
  title: {
    variant: "h1",
  },
  description: {
    position: "top",
  },
  focus_ring: false,
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
  config?: FormFieldLayoutConfig | undefined;
  className?: string;
}) {
  const margedConfig = { ...DefaultFormFieldConfig, ...config };
  const [isFocused, setIsFocused] = useState(false);

  return (
    <FormFieldLayoutProvider focused={isFocused} setFocused={setIsFocused}>
      <div
        className={cn(
          "group relative flex w-full flex-col space-y-2",
          margedConfig.title?.variant === "h1" && "rounded-lg p-4 shadow-[0_0_14px_rgba(0,0,0,0.1)]",

          margedConfig.focus_ring &&
            "focus-within:ring-primary transition-shadow duration-200 focus-within:ring-2 focus-within:ring-offset-2",
          isFocused && "ring-primary ring-2 ring-offset-2",
          className,
        )}
      >
        {title && (
          <div className="flex flex-row space-x-2 pl-0">
            <FormFieldTitle text={title} inputId={inputId} variant={margedConfig.title?.variant} />
          </div>
        )}
        {description && margedConfig.description?.position === "top" && (
          <FormFieldDescription className="pb-4" text={description} inputId={inputId} />
        )}

        {children}

        {description && margedConfig.description?.position === "bottom" && (
          <FormFieldDescription className="pt-1" text={description} inputId={inputId} />
        )}

        {error && <FormFieldError error={error} inputId={inputId} className="mt-1" />}
      </div>
    </FormFieldLayoutProvider>
  );
});
