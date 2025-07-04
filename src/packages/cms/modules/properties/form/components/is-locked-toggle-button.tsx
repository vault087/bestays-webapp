import { Lock } from "lucide-react";
import { memo } from "react";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { BoolToggleButton, BoolToggleButtonProps } from "./utils/property-toggle-button";

export const IsLockedToggleButton = memo(function IsLockedToggleButton(
  props: Omit<BoolToggleButtonProps, "propertyKey" | "icon" | "tooltipKey">,
) {
  useDebugRender("IsLockedToggleButton");
  return (
    <BoolToggleButton
      propertyKey="is_locked"
      icon={Lock}
      tooltipKey={{ active: "property.is-locked.tooltip.on", inactive: "property.is-locked.tooltip.off" }}
      {...props}
    />
  );
});

IsLockedToggleButton.displayName = "IsLockedToggleButton";
