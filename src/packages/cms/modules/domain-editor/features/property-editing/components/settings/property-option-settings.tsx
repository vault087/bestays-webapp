import { memo } from "react";
import {
  PropertyOptionMetaSettings,
  PropertyOptionList,
} from "@cms/modules/domain-editor/features/property-editing/components/property-options";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useType } from "@cms/modules/properties/form";

export const PropertyOptionSettings = memo(function PropertyOptionSettings() {
  useDebugRender("PropertyOptionSettings");
  const { propertyType } = useType();

  // Only render for option type properties
  if (propertyType !== "option") {
    return null;
  }

  return (
    <div data-testid="property-option-settings" className="flex w-full flex-col space-y-2">
      {/* Meta Settings Section */}
      <div data-testid="property-option-meta-settings" className="flex w-full items-center">
        <PropertyOptionMetaSettings />
      </div>

      {/* Option List Section */}
      <div data-testid="property-option-list" className="flex w-full flex-col">
        <PropertyOptionList />
      </div>
    </div>
  );
});

// Add default export for lazy loading
export default PropertyOptionSettings;
