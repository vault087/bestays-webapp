import React, { memo, useCallback, useMemo } from "react";
import { FormOption } from "@/components/form";
import { DBCurrency, getCurrencySymbol } from "@/entities/common";
import { Input } from "@/modules/shadcn";
import { cn } from "@/modules/shadcn/utils/cn";
import { FormDropDown } from "./form-dropdown";

export const FormPriceInput = memo(function FormPriceInput({
  inputId,
  value,
  onChange,
  max,
  arialInvalid = false,
  className,
  currency,
  currencies,
  onCurrencyChange,
}: {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  max?: number | undefined;
  arialInvalid?: boolean;
  className?: string;
  currency: DBCurrency;
  currencies: DBCurrency[];
  onCurrencyChange: (currency: DBCurrency) => void;
}) {
  const currencySymbol = useMemo(() => getCurrencySymbol(currency), [currency]);
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

  return (
    <div className={cn("relative flex", className)}>
      <div className="w-full rounded-md rounded-e-none border-1 border-e-0 shadow-xs">
        <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm select-none">
          {currencySymbol}
        </span>
        <Input
          id={inputId}
          className={cn(
            "-me-px rounded-none border-none ps-6 pe-4 text-right shadow-none",
            "appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          )}
          name="price"
          placeholder="0.00"
          type="number"
          max={max}
          aria-invalid={arialInvalid}
          aria-describedby={arialInvalid ? `${inputId}-error` : `${inputId}-description`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <FormDropDown
        selectedOption={dropdownValue}
        options={dropdownValues}
        selectOption={dropdownOnChanged}
        className="rounded-s-none rounded-e-md"
      />
    </div>
  );
});
