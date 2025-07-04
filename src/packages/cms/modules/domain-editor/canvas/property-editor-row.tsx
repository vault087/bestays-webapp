import { memo } from "react";
import { PropertyEditor } from "@cms/modules/domain-editor/features/property-editing";
import { PropertyPreview } from "@cms/modules/domain-editor/features/property-previews";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store/layout.store.hooks";

export const PropertyEditorRow = memo(() => {
  useDebugRender("PropertyEditorRow");
  const store = useLayoutStore();
  const showPreview = store((state) => state.showPreview);

  return (
    <div className="flex flex-row items-center space-x-2">
      <div className={`flex items-center justify-center ${showPreview ? "w-1/2" : "w-full"}`}>
        <PropertyEditor />
      </div>

      {showPreview && (
        <div className="relative z-20 flex w-1/2 items-center justify-center bg-transparent">
          <div className="w-full bg-transparent">
            <PropertyPreview />
          </div>
        </div>
      )}
    </div>
  );
});

PropertyEditorRow.displayName = "PropertyEditorRow";
