import deepmerge from "deepmerge";
import React, { memo } from "react";
import { FloatingLabel, FloatingInput } from "@/modules/shadcn";
import { cn } from "@/modules/shadcn/utils/cn";

export type FormFloatingInputConfig = {
  characterCount: {
    always_show: boolean;
  };
};
export const DefaultFormFloatingInputConfig: FormFloatingInputConfig = {
  characterCount: {
    always_show: true,
  },
};

export const FormFloatingInput = memo(function FormFloatingInput({
  inputId,
  value,
  onChange,
  characterCount,
  maxLength,
  placeholder,
  arialInvalid = false,
  className,
  config,
}: {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  characterCount: number;
  maxLength: number;
  placeholder: string;
  arialInvalid?: boolean;
  className?: string;
  config?: FormFloatingInputConfig;
}) {
  const margedConfig = deepmerge(DefaultFormFloatingInputConfig, config || {});

  return (
    <div className={cn("relative flex w-full flex-col space-y-2", className)}>
      <FloatingInput
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder || ""}
        aria-invalid={arialInvalid}
        aria-describedby={arialInvalid ? `${inputId}-error` : `${inputId}-description`}
        className="selection:bg-primary border-b-0 bg-transparent not-placeholder-shown:translate-y-2 focus:translate-y-2 dark:bg-transparent"
      />
      <FloatingLabel htmlFor={inputId} className="start-0 max-w-[calc(100%-0.5rem)]">
        {placeholder}
      </FloatingLabel>

      <p
        id={`${inputId}-description`}
        className="text-muted-foreground mt-2 text-right text-xs"
        role="status"
        aria-live="polite"
      >
        {(margedConfig.characterCount.always_show || characterCount === maxLength) && (
          <span className="tabular-nums">
            {characterCount} / {maxLength}
          </span>
        )}
      </p>
    </div>
  );
});
