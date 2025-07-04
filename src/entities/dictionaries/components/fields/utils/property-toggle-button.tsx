import type { LucideIcon } from "lucide-react";
import { memo } from "react";
import { QuickTooltip } from "@shared-ui/components/ui/quick-tooltip";
import { cn } from "@/modules/shadcn";
import { Button } from "@/modules/shadcn/components/ui/button";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useBoolToggle } from "@cms/modules/properties/form/hooks/utils/use-bool";
import type { FormProperty } from "@cms/modules/properties/form/types";

export interface BoolToggleButtonProps {
  propertyKey: keyof Pick<FormProperty, "is_locked" | "is_private" | "is_required">;
  icon: LucideIcon;
  tooltipKey: { active: string; inactive: string };
  alwaysVisible?: boolean;
  className?: string;
}

export const BoolToggleButton = memo(function BoolToggleButton({
  propertyKey,
  icon: Icon,
  tooltipKey,
  alwaysVisible = true,
  className,
}: BoolToggleButtonProps) {
  const { t } = useCMSTranslations();
  const { isActive, handleToggle } = useBoolToggle(propertyKey);

  return (
    <QuickTooltip content={isActive ? t(tooltipKey.active) : t(tooltipKey.inactive)}>
      <Button
        variant="ghost"
        size="xs"
        onClick={handleToggle}
        className={cn(
          "hover:text-accent-foreground transition-opacity duration-250 hover:bg-transparent dark:hover:bg-transparent",
          isActive ? "opacity-100" : alwaysVisible ? "opacity-100" : "opacity-0 group-hover:opacity-60",
          className,
        )}
        aria-pressed={isActive}
        type="button"
        role="button"
      >
        <Icon size={13} aria-hidden="true" className={cn(isActive ? "text-primary" : "text-muted-foreground")} />
      </Button>
    </QuickTooltip>
  );
});

BoolToggleButton.displayName = "BoolToggleButton";
