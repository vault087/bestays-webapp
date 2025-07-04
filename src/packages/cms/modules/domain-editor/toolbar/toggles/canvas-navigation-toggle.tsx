"use client";

import { AlignEndVertical } from "lucide-react";
import { memo } from "react";
import { ToggleGroup } from "@/modules/shadcn/components/ui/toggle-group";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store/layout.store.hooks";
import { ToolbarToggleItem } from "@cms/modules/domain-editor/toolbar/toolbar-toggle-item";

export const CanvasNavigationToggle = memo(function CanvasNavigationToggle() {
  useDebugRender("CanvasNavigationToggle");
  const { t } = useCMSTranslations();
  const layoutStore = useLayoutStore();

  const showPropertiesTree = layoutStore((state) => state.showPropertiesTree);
  const currentValue = showPropertiesTree ? "tree-open" : "tree-closed";

  const handleValueChange = (value: string) => {
    const newValue = value === "tree-open";
    layoutStore.getState().setShowPropertiesTree(newValue);
  };

  const toggleGroupItem = <ToolbarToggleItem value="tree-open" icon={AlignEndVertical} tooltip={t("tree-toggle")} />;

  return (
    <ToggleGroup type="single" value={currentValue} onValueChange={handleValueChange}>
      {toggleGroupItem}
    </ToggleGroup>
  );
});
