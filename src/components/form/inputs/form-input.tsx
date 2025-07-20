import React, { memo } from "react";
import { Input } from "@/modules/shadcn";
import { cn } from "@/modules/shadcn/utils/cn";

export const FormInput = memo(function FormInput({
  inputId,
  value,
  onChange,
  characterCount,
  maxLength,
  placeholder,
  arialInvalid = false,
  className,
}: {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  characterCount: number;
  maxLength: number;
  placeholder: string;
  arialInvalid?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      <Input
        id={inputId}
        type="text"
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ""}
        aria-invalid={arialInvalid}
        aria-describedby={arialInvalid ? `${inputId}-error` : `${inputId}-description`}
        className={cn("h-8 border-0 bg-transparent py-0 font-mono text-xs shadow-none dark:bg-transparent", className)}
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
