import { memo, useCallback } from "react";
import { QuickTooltip } from "@/components/ui/quick-tooltip";
import { FloatingInput, FloatingLabel } from "@/modules/shadcn/components/ui/floating-label-input";
import { ToggleGroup, ToggleGroupItem } from "@/modules/shadcn/components/ui/toggle-group";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useMetaNumberInteger, useMetaNumberMaxInput, useMetaNumberMinInput } from "@cms/modules/properties/form";

export const PropertyNumberSettings = memo(function PropertyNumberSettings() {
  return (
    <div className="flex w-full flex-row items-center justify-between space-x-1">
      <div className="flex w-2/3 items-center px-1">
        <PropertyNumberMinMaxSettings />
      </div>
      <div className="flex w-1/3 items-center px-1">
        <PropertyNumberFormatSettings />
      </div>
    </div>
  );
});

export const PropertyNumberFormatSettings = memo(function PropertyNumberFormatSettings() {
  const { isActive, handleSetIsActive } = useMetaNumberInteger();
  const currentValue = isActive ? "integer" : "float";

  const handleValueChange = useCallback(
    (value: string) => {
      if (value) {
        handleSetIsActive(value === "integer");
      }
    },
    [handleSetIsActive],
  );

  const { t } = useCMSTranslations();

  const displayValue = currentValue || "integer";
  const toggleStyle = "flex h-8 min-w-12 items-center justify-center font-bold tracking-wider text-muted-foreground";

  return (
    <div className="flex w-full items-center justify-center px-1 pb-0">
      <ToggleGroup
        type="single"
        value={displayValue}
        onValueChange={handleValueChange}
        className="bg-background border-input rounded-md border"
      >
        <QuickTooltip content={t("property.number.tooltip.integer")}>
          <div>
            <ToggleGroupItem value="integer" className={toggleStyle}>
              0
            </ToggleGroupItem>
          </div>
        </QuickTooltip>
        <QuickTooltip content={t("property.number.tooltip.decimal")}>
          <div>
            <ToggleGroupItem value="float" className={toggleStyle}>
              0.0
            </ToggleGroupItem>
          </div>
        </QuickTooltip>
      </ToggleGroup>
    </div>
  );
});

export const PropertyNumberMinMaxSettings = memo(function PropertyNumberMinMaxSettings() {
  const { t } = useCMSTranslations();
  const { inputId: inputIdMin, value: valueMin, onChange: onChangeMin } = useMetaNumberMinInput("Input");
  const { inputId: inputIdMax, value: valueMax, onChange: onChangeMax } = useMetaNumberMaxInput("Input");

  const containerStyle = "flex h-14 flex-col items-start justify-center space-y-0";
  const inputStyle =
    "selection:bg-primary rounded-md border-1 bg-transparent px-1 text-center not-placeholder-shown:translate-y-0 peer-placeholder-shown:-translate-y-0 peer-focus:-translate-y-0 focus:translate-y-0 dark:bg-transparent py-0";
  const labelStyle =
    "bg-background peer-focus:text-primary start-2 -translate-y-4.5 px-1 peer-focus:-translate-y-4.5 peer-focus:px-1";

  return (
    <div className="flex w-full items-center">
      <QuickTooltip content={t("property.number.tooltip.min")}>
        <div className={containerStyle}>
          <div className="relative flex w-full">
            <FloatingInput
              id={inputIdMin}
              value={valueMin}
              onChange={onChangeMin}
              type="number"
              className={inputStyle}
            />
            <FloatingLabel htmlFor={inputIdMin} className={labelStyle}>
              {t("property.number.min-label")}
            </FloatingLabel>
          </div>
        </div>
      </QuickTooltip>

      <span className="text-muted-foreground px-1 text-sm">-</span>

      <QuickTooltip content={t("property.number.tooltip.max")}>
        <div className={containerStyle}>
          <div className="relative flex w-full">
            <FloatingInput
              id={inputIdMax}
              value={valueMax}
              onChange={onChangeMax}
              type="number"
              className={inputStyle}
            />
            <FloatingLabel htmlFor={inputIdMax} className={labelStyle}>
              {t("property.number.max-label")}
            </FloatingLabel>
          </div>
        </div>
      </QuickTooltip>
    </div>
  );
});
