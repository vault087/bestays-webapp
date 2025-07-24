"use client";

import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { FormFieldPreview } from "@/components/form/layout";
import { DBCurrency, formatMoneyDisplay, getCurrencySymbol } from "@/entities/common";
import { Input } from "@/modules/shadcn";
import { cn } from "@/modules/shadcn/utils/cn";

export const FormPriceInput = memo(function FormPriceInput({
  inputId,
  locale,
  value,
  onChange,
  arialInvalid = false,
  className,
  currency,
  disabled = false,
}: {
  inputId: string;
  locale: string;
  value: string;
  onChange: (value: string) => void;
  arialInvalid?: boolean;
  className?: string;
  currency: DBCurrency;
  disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const currencySymbol = useMemo(() => getCurrencySymbol(currency), [currency]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const rawValue = inputValue.replace(/[^\d.]/g, ""); // Extract raw numeric value
      onChange(rawValue);
    },
    [onChange],
  );

  const inputRef = useRef<HTMLInputElement | null>(null);

  const formatDisplayValue = useCallback(
    (value: string): string => {
      return formatMoneyDisplay(value, locale, currency, "number");
    },
    [locale, currency],
  );

  // on handleBlur we set value as a displayed value
  // on focus we set value as a raw value

  const handleFocus = useCallback(() => {
    setFocused(true);
    if (inputRef.current) {
      inputRef.current.value = value;
    }
  }, [value]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    if (inputRef.current) {
      inputRef.current.value = formatDisplayValue(value);
    }
  }, [formatDisplayValue, value]);

  const pricePreview = useMemo(
    () => formatMoneyDisplay(value, locale, currency, "narrowSymbol"),
    [value, locale, currency],
  );

  return (
    <div
      className={cn("relative flex", "text-muted-foreground", disabled && "pointer-events-none opacity-50", className)}
    >
      <div className="flex flex-col">
        {/* Outside Border Area */}
        <div className="flex">
          {/* Inside Border Area */}
          <div
            className={cn(
              "flex w-full flex-row rounded-md rounded-e-none border-1 border-e-0 shadow-xs",
              focused && !disabled && "border-primary",
            )}
          >
            <span className="pointer-events-none flex items-center justify-center ps-3 text-sm select-none">
              {currencySymbol}
            </span>
            <Input
              id={inputId}
              ref={inputRef}
              disabled={disabled}
              className={cn(
                "-me-px rounded-none border-none ps-6 pe-4 text-right shadow-none",
                "appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                "focus-visible:border-primary",
              )}
              name="price"
              defaultValue={value}
              placeholder={formatDisplayValue("0")}
              type="text"
              aria-invalid={arialInvalid}
              aria-describedby={arialInvalid ? `${inputId}-error` : `${inputId}-description`}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </div>
          <div
            className={cn(
              "flex items-center rounded-s-none rounded-e-md border-1 px-2",
              focused && !disabled && "border-primary",
            )}
          >
            <span className="pointer-events-none flex items-center justify-center text-sm uppercase select-none">
              {currency}
            </span>
          </div>
        </div>
        <FormFieldPreview previewValue={pricePreview} className="pt-1" />
      </div>
    </div>
  );
});
