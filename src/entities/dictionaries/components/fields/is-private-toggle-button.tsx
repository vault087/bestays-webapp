import { EyeOff } from "lucide-react";
import { memo } from "react";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { BoolToggleButton, BoolToggleButtonProps } from "./utils/property-toggle-button";

export const IsPrivateToggleButton = memo(function IsPrivateToggleButton(
  props: Omit<BoolToggleButtonProps, "propertyKey" | "icon" | "tooltipKey">,
) {
  useDebugRender("IsPrivateToggleButton");
  return (
    <BoolToggleButton
      propertyKey="is_private"
      icon={EyeOff}
      tooltipKey={{ active: "property.is-private.tooltip.on", inactive: "property.is-private.tooltip.off" }}
      {...props}
    />
  );
});

IsPrivateToggleButton.displayName = "IsPrivateToggleButton";
