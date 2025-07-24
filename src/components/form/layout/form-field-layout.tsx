"use client";

import deepmerge from "deepmerge";
import { EyeOffIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { QuickTooltip } from "@/components/ui";
import { cn } from "@/modules/shadcn/utils/cn";
import { FormFieldDescription } from "./form-field-description";
import { FormFieldError } from "./form-field-error";
import { FormFieldLayoutProvider } from "./form-field-layout.context";
import { FormFieldTitle, FormFieldTitleVariant } from "./form-field-title";

export type FormFieldLayoutConfig = {
  title?: {
    variant?: FormFieldTitleVariant | undefined;
  };
  focus_ring?: boolean;
  isPrivate?: boolean;
};

const DefaultFormFieldConfig: FormFieldLayoutConfig = {
  title: {
    variant: "h1",
  },
  focus_ring: false,
  isPrivate: false,
};

export const FormFieldLayout = memo(function FormFieldLayout({
  children,
  inputId,
  title,
  description,
  error,
  config,
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
  const margedConfig = deepmerge(DefaultFormFieldConfig, config || {});

  const t = useTranslations("Common");
  const tooltipText = t("form-field.private_indicator_tooltip");

  return (
    <FormFieldLayoutProvider
      focused={true}
      setFocused={(value) => {
        console.log("setFocused", value);
      }}
    >
      <div
        className={cn(
          "group bg-card relative flex w-full flex-col space-y-2",
          config?.isPrivate && "border-muted-foreground/80 border-1 border-dashed",
          margedConfig.title?.variant === "h1" && "rounded-lg p-4 shadow-[0_0_14px_rgba(0,0,0,0.1)]",
          margedConfig.focus_ring && "focus-within:ring-primary focus-within:ring-2 focus-within:ring-offset-2",
          // isFocused && "ring-primary ring-2 ring-offset-2",
          className,
        )}
        // onClick={handleClick}
        // onBlur={handleBlur}
        tabIndex={-1} // Allow div to receive focus events
      >
        {title && (
          <div className="relative flex flex-row space-x-2 pl-0">
            <FormFieldTitle text={title} inputId={inputId} variant={margedConfig.title?.variant} />
            {margedConfig.isPrivate && (
              <QuickTooltip content={<span className="text-xs">{tooltipText}</span>}>
                <EyeOffIcon className="text-muted-foreground h-3.5 w-3.5 opacity-80" />
              </QuickTooltip>
            )}
          </div>
        )}
        {description && <FormFieldDescription className="pb-1" text={description} inputId={inputId} />}

        {children}

        {error && <FormFieldError error={error} inputId={inputId} className="mt-1" />}
      </div>
    </FormFieldLayoutProvider>
  );
});
