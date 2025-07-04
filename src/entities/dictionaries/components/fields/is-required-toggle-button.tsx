import { Asterisk } from "lucide-react";
import { memo } from "react";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { BoolToggleButton, BoolToggleButtonProps } from "./utils/property-toggle-button";

export const IsRequiredToggleButton = memo(function IsRequiredToggleButton(
  props: Omit<BoolToggleButtonProps, "propertyKey" | "icon" | "tooltipKey">,
) {
  useDebugRender("IsRequiredToggleButton");
  return (
    <BoolToggleButton
      propertyKey="is_required"
      icon={Asterisk}
      tooltipKey={{ active: "property.is-required.tooltip.on", inactive: "property.is-required.tooltip.off" }}
      {...props}
    />
  );
});

IsRequiredToggleButton.displayName = "IsRequiredToggleButton";
