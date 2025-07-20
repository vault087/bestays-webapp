import React, { memo } from "react";
import { Input } from "@/modules/shadcn";
import { cn } from "@/modules/shadcn/utils/cn";

export type FormTextInputConfig = {
  characterCount: {
    always_show: boolean;
    inline: boolean;
  };
};

const DefaultFormTextInputConfig: FormTextInputConfig = {
  characterCount: {
    always_show: true,
    inline: true,
  },
};

export const FormTextInput = memo(function FormTextInput({
  inputId,
  value,
  onChange,
  characterCount,
  maxLength,
  placeholder,
  arialInvalid = false,
  className,
  config = DefaultFormTextInputConfig,
}: {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  characterCount: number;
  maxLength: number;
  placeholder: string;
  arialInvalid?: boolean;
  className?: string;
  config?: FormTextInputConfig;
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-1",
        config.characterCount.inline && "flex-row items-center justify-center space-x-1",
        !config.characterCount.inline && "flex-col space-y-0",
        className,
      )}
    >
      <Input
        id={inputId}
        type="text"
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ""}
        aria-invalid={arialInvalid}
        aria-describedby={arialInvalid ? `${inputId}-error` : `${inputId}-description`}
        className={"h-12 border-0 py-0 font-mono text-xs shadow-none dark:bg-transparent"}
      />
      <div>
        <p
          id={`${inputId}-description`}
          className={cn(
            "text-muted-foreground flex text-end text-xs whitespace-nowrap",
            config.characterCount.inline && "",
            !config.characterCount.inline && "",
          )}
          role="status"
          aria-live="polite"
        >
          {characterCount} / {maxLength}
        </p>
      </div>
    </div>
  );
});
