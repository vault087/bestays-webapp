"use client";

import { ChangeEvent, memo } from "react";
import { cn, Textarea } from "@/modules/shadcn/";

type FormTextAreaConfig = {
  textarea_className?: string;
};

// Base Input
export const FormTextArea = memo(function FormTextArea({
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
  config?: FormTextAreaConfig;
}) {
  const onTextAreaChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    onChange(e.target.value);
  };

  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      <Textarea
        id={inputId}
        value={value}
        maxLength={maxLength}
        onChange={onTextAreaChange}
        placeholder={placeholder || ""}
        aria-invalid={arialInvalid}
        aria-describedby={arialInvalid ? `${inputId}-error` : `${inputId}-description`}
        className={config?.textarea_className}
      />
      <p
        id={`${inputId}-description`}
        className="text-muted-foreground mt-2 text-right text-xs"
        role="status"
        aria-live="polite"
      >
        <span className="tabular-nums">{characterCount}</span> / {maxLength}
      </p>
    </div>
  );
});
