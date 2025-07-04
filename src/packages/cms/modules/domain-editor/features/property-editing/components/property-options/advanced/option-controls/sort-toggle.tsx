import { IconGripVertical, IconSortAscendingLetters } from "@tabler/icons-react";
import { memo, useCallback } from "react";
import { QuickTooltip } from "@/components/ui/quick-tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/modules/shadcn/components/ui/toggle-group";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useMetaOptionSorting } from "@cms/modules/properties/form";

// Sorting Toggle (Manual vs Alphabetical)
export const PropertyOptionSortingToggle = memo(function PropertyOptionSortingToggle() {
  useDebugRender("PropertyOptionSortingToggle");
  const { t } = useCMSTranslations();
  const { value: currentValue, setValue: setCurrentValue } = useMetaOptionSorting();

  const handleValueChange = useCallback(
    (value: string) => {
      if (value) {
        setCurrentValue(value as "manual" | "alphabet");
      }
    },
    [setCurrentValue],
  );

  const displayValue = currentValue || "alphabet";
  const toggleStyle = "flex h-8 min-w-12 items-center justify-center font-bold tracking-wider text-muted-foreground";

  return (
    <div className="flex w-full items-center justify-center px-1 pb-0">
      <ToggleGroup
        type="single"
        value={displayValue}
        onValueChange={handleValueChange}
        className="bg-background border-input rounded-md border"
        data-testid="option-sorting-toggle"
      >
        <QuickTooltip content={t("property.option.manual-sorting")}>
          <div>
            <ToggleGroupItem value="manual" className={toggleStyle}>
              <IconGripVertical />
            </ToggleGroupItem>
          </div>
        </QuickTooltip>
        <QuickTooltip content={t("property.option.alphabetical-sorting")}>
          <div>
            <ToggleGroupItem value="alphabet" className={toggleStyle}>
              <IconSortAscendingLetters />
            </ToggleGroupItem>
          </div>
        </QuickTooltip>
      </ToggleGroup>
    </div>
  );
});
