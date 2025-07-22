"use client";

import React, { memo, useCallback, useMemo, useRef } from "react";
import { FormOption } from "@/components/form";
import { DBCurrency, formatMoneyDisplay, getCurrencySymbol } from "@/entities/common";
import { Input } from "@/modules/shadcn";
import { cn } from "@/modules/shadcn/utils/cn";
import { FormDropDown } from "./form-dropdown";

export const FormPriceInput = memo(function FormPriceInput({
  inputId,
  locale,
  value,
  onChange,
  arialInvalid = false,
  className,
  currency,
  currencies,
  onCurrencyChange,
}: {
  inputId: string;
  locale: string;
  value: string;
  onChange: (value: string) => void;
  arialInvalid?: boolean;
  className?: string;
  currency: DBCurrency;
  currencies: DBCurrency[];
  onCurrencyChange: (currency: DBCurrency) => void;
}) {
  const currencySymbol = useMemo(() => getCurrencySymbol(currency), [currency]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const rawValue = inputValue.replace(/[^\d.]/g, ""); // Extract raw numeric value
      onChange(rawValue);
    },
    [onChange],
  );

  const currencyToDropDownOption = useCallback(
    (currency: DBCurrency): FormOption => ({
      key: currency,
      label: currency,
    }),
    [],
  );

  const dropdownValue = useMemo(() => currencyToDropDownOption(currency), [currency, currencyToDropDownOption]);
  const dropdownValues = useMemo(
    () => currencies.map(currencyToDropDownOption),
    [currencies, currencyToDropDownOption],
  );
  const dropdownOnChanged = useCallback(
    (option: FormOption) => onCurrencyChange(option.key as DBCurrency),
    [onCurrencyChange],
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
    if (inputRef.current) {
      inputRef.current.value = value;
    }
  }, [value]);

  const handleBlur = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = formatDisplayValue(value);
    }
  }, [formatDisplayValue, value]);

  return (
    <div className={cn("relative flex", "text-muted-foreground focus-within:text-primary", className)}>
      <div className="w-full rounded-md rounded-e-none border-1 border-e-0 shadow-xs">
        <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm select-none">
          {currencySymbol}
        </span>
        <Input
          id={inputId}
          ref={inputRef}
          className={cn(
            "-me-px rounded-none border-none ps-6 pe-4 text-right shadow-none",
            "appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            "focus-visible:text-primary",
          )}
          name="price"
          defaultValue={value}
          placeholder={formatDisplayValue("0")}
          type="text"
          aria-invalid={arialInvalid}
          aria-describedby={arialInvalid ? `${inputId}-error` : `${inputId}-description`}
          // value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>
      {dropdownValues.length > 1 && (
        <FormDropDown
          selectedOption={dropdownValue}
          options={dropdownValues}
          selectOption={dropdownOnChanged}
          className="rounded-s-none rounded-e-md"
        />
      )}
      {dropdownValues.length === 1 && (
        <div className="flex items-center rounded-s-none rounded-e-md border-1 px-2">
          <span className="pointer-events-none flex items-center justify-center text-sm select-none">
            {dropdownValue.label}
          </span>
        </div>
      )}
    </div>
  );
});
