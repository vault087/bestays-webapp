"use client";

import { Type, Hash, ToggleRight, RulerDimensionLine, CircleCheck } from "lucide-react";
import { memo, useCallback, useContext, useMemo, useState } from "react";
import { QuickTooltip } from "@/components/ui/quick-tooltip";
import { Button } from "@/modules/shadcn/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/shadcn/components/ui/popover";
import { createPropertyMeta } from "@cms-data/modules/properties/property.utils";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { PropertyRowContext } from "@cms/modules/domain-editor/contexts";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useReactiveValue } from "@cms/modules/domain-editor/hooks/use-property";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";
import { FormProperty } from "@cms/modules/properties/form/types";
import { PropertyType } from "@cms/modules/properties/property.types";

export const PropertyTypeInput = memo(() => {
  useDebugRender("PropertyTypeInput");

  const { t } = useCMSTranslations();
  const { propertyId } = useContext(PropertyRowContext)!;
  const canvasStore = useCanvasStore();
  const getStoreValue = useCallback((property: FormProperty) => property.type, []);
  const setStoreValue = useCallback((property: FormProperty, value: string) => {
    property.type = value as PropertyType;
  }, []);

  const { value: propertyType, setValue: setPropertyType } = useReactiveValue({
    getValue: getStoreValue,
    setValue: setStoreValue,
  });

  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleClose = useCallback(
    (type?: string) => {
      setPopoverOpen(false);
      if ((type as PropertyType) && type !== propertyType) {
        setPropertyType(type as PropertyType);

        canvasStore.getState().updateProperty(propertyId, (draft) => {
          draft.meta = createPropertyMeta(type as PropertyType);
        });
      }
    },
    [propertyId, propertyType, setPropertyType, canvasStore],
  );

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      {/**
       * ⚠️ CRITICAL COMPOSITION PATTERN - DO NOT MODIFY
       *
       * PopoverTrigger requires asChild prop for proper Radix composition.
       * Any structural changes will break popover trigger functionality.
       * Protected by: __tests__/composition-integrity/as-child-pattern.test.tsx
       */}
      <PopoverTrigger asChild>
        <Button size="icon" variant="outline" className="border-0 bg-transparent shadow-none">
          <div className="flex flex-col items-center justify-center">
            <QuickTooltip content={t(`property_type.${propertyType}`)}>
              {/* <div className="relative z-0"> */}
              <div>
                <PropertyTypeIndicator propertyType={propertyType as PropertyType} />
              </div>
              {/* </div> */}
            </QuickTooltip>
          </div>
        </Button>
      </PopoverTrigger>

      <PropertyTypePopover onClose={handleClose} />
    </Popover>
  );
});

PropertyTypeInput.displayName = "PropertyTypeInput";

const PropertyTypePopover = memo(({ onClose }: { onClose: (type?: PropertyType) => void }) => {
  useDebugRender("PropertyTypePopover");
  const orderedTypes: PropertyType[] = ["text", "number", "option", "bool", "size"];

  const handleClick = useCallback(
    (type: PropertyType) => {
      onClose(type);
    },
    [onClose],
  );

  return (
    <PopoverContent className="w-auto overflow-y-auto p-3">
      <div className="flex w-full flex-col space-y-0">
        {orderedTypes.map((type) => (
          <Button key={type} variant="ghost" className="justify-start py-6 ps-2 pe-6" onClick={() => handleClick(type)}>
            <PropertyTypeItem propertyType={type} />
          </Button>
        ))}
      </div>
    </PopoverContent>
  );
});

PropertyTypePopover.displayName = "PropertyTypePopover";

function PropertyTypeItem({ propertyType }: { propertyType: PropertyType }) {
  const { t } = useCMSTranslations();

  type TypeData = {
    type: PropertyType;
    label: string;
    description: string;
  };

  const typeData: TypeData = useMemo(() => {
    switch (propertyType) {
      case "number":
        return {
          type: propertyType,
          label: t("property_type.number"),
          description: t("property_type.number_description"),
        };
      case "bool":
        return {
          type: propertyType,
          label: t("property_type.bool"),
          description: t("property_type.bool_description"),
        };
      case "option":
        return {
          type: propertyType,
          label: t("property_type.option"),
          description: t("property_type.option_description"),
        };
      case "size":
        return {
          type: propertyType,
          label: t("property_type.size"),
          description: t("property_type.size_description"),
        };
      default:
        return {
          type: propertyType,
          label: t("property_type.text"),
          description: t("property_type.text_description"),
        };
    }
  }, [propertyType, t]);

  return (
    <div key={typeData.label} className="flex flex-row items-start justify-start space-x-4">
      <PropertyTypeIndicator propertyType={propertyType} />
      <div className="flex flex-col items-start justify-center space-y-0">
        <div className="text-sm font-medium">{typeData.label}</div>
        <div className="text-muted-foreground text-xs">{typeData.description}</div>
      </div>
    </div>
  );
}

PropertyTypeItem.displayName = "PropertyTypeItem";

function PropertyTypeIndicator({ propertyType }: { propertyType: PropertyType }) {
  type IconData = {
    icon: React.ReactNode;
    backgroundColor: string;
  };

  const iconData: IconData = useMemo(() => {
    switch (propertyType) {
      case "number":
        return {
          icon: <Hash />,
          backgroundColor: "bg-blue-500/40",
        };
      case "bool":
        return {
          icon: <ToggleRight />,
          backgroundColor: "bg-orange-500/40",
        };
      case "option":
        return {
          icon: <CircleCheck />,
          backgroundColor: "bg-amber-500/40",
        };
      case "size":
        return {
          icon: <RulerDimensionLine />,
          backgroundColor: "bg-green-500/40",
        };
      case "text":
      default:
        return {
          icon: <Type />,
          backgroundColor: "bg-purple-500/40",
        };
    }
  }, [propertyType]);

  return <div className={`rounded-md p-2 ${iconData.backgroundColor}`}>{iconData.icon}</div>;
}

PropertyTypeIndicator.displayName = "PropertyTypeIndicator";
