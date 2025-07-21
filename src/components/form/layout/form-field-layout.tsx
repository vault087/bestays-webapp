import { GlobeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { QuickTooltip } from "@/components/ui";
import { cn } from "@/modules/shadcn/utils/cn";
import { FormFieldDescription } from "./form-field-description";
import { FormFieldError } from "./form-field-error";
import { FormFieldTitle, FormFieldTitleVariant } from "./form-field-title";
export type FormFieldLayoutConfig = {
  title?: {
    variant?: FormFieldTitleVariant | undefined;
  };
  showGlobe?: boolean;
};

const DefaultFormFieldConfig: FormFieldLayoutConfig = {
  title: {
    variant: "h1",
  },

  showGlobe: false,
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
  inputId: string;
  title?: string | undefined | null;
  description?: string | undefined | null;
  error?: string | undefined | null;
  config?: FormFieldLayoutConfig;
  className?: string;
}) {
  const t = useTranslations("Common");
  const globeTooltip = t("form-field.globe-tooltip");
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {title && (
        <div className="flex flex-row space-x-2">
          <FormFieldTitle text={title} inputId={inputId} variant={config.title?.variant} />
          {config.showGlobe && (
            <QuickTooltip content={globeTooltip}>
              <GlobeIcon className="text-primary h-3.5 w-3.5" />
            </QuickTooltip>
          )}
        </div>
      )}
      {description && <FormFieldDescription text={description} inputId={inputId} />}

      {children}

      {error && <FormFieldError error={error} inputId={inputId} className="mt-1" />}
    </div>
  );
});
