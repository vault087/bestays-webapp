"use client";

import { ChangeEvent, memo } from "react";
import { cn, Textarea } from "@/modules/shadcn/";

// Base Input
export const FormTextArea = memo(function FormTextArea({
  inputId,
  value,
  onChange,
  characterCount,
  maxLength,
  placeholder,
  className,
}: {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  characterCount: number;
  maxLength: number;
  placeholder: string;
  className?: string;
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
    </div>
  );
});
