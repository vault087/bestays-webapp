import { memo, useCallback, useMemo } from "react";
import { FloatingInput, FloatingLabel } from "@/modules/shadcn/components/ui/floating-label-input";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { usePropertyContext } from "@cms/modules/domain-editor/contexts";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useUncontrolledInput } from "@cms/modules/domain-editor/hooks/use-property";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store/layout.store.hooks";
import { FormProperty } from "@cms/modules/properties/form/types";

export const PropertyDescriptionInput = memo(() => {
  useDebugRender("PropertyDescriptionInput");

  const { t } = useCMSTranslations();
  const layoutStore = useLayoutStore();
  const canvasStore = useCanvasStore();
  const currentTranslation = layoutStore((state) => state.currentTranslation) || "";
  const currentLocale = layoutStore((state) => state.currentLocale);

  const getValue = useCallback(
    (property: FormProperty) => property.description?.[currentTranslation] || "",
    [currentTranslation],
  );
  const setValue = useCallback(
    (draft: FormProperty, value: string) => {
      if (!draft.description) draft.description = {};
      draft.description[currentTranslation] = value.trim();
    },
    [currentTranslation],
  );

  const { inputRef, defaultValue, onChange } = useUncontrolledInput({
    getValue,
    setValue,
    locale: currentTranslation,
  });

  const { propertyId } = usePropertyContext();
  const inputId = `property-description-input-${propertyId}-${currentTranslation}`;

  const mainDescription = useMemo(() => {
    if (currentTranslation === currentLocale) {
      return null;
    } else {
      const defaultName = canvasStore.getState().properties[propertyId].description?.[currentLocale];
      return defaultName;
    }
  }, [currentTranslation, currentLocale, propertyId, canvasStore]);

  return (
    <div className="relative flex w-full" key={currentTranslation}>
      <FloatingInput
        id={inputId}
        ref={inputRef}
        defaultValue={defaultValue}
        onChange={onChange}
        className="selection:bg-primary border-b-0 bg-transparent px-1 not-placeholder-shown:translate-y-2 focus:translate-y-2 dark:bg-transparent"
      />
      <FloatingLabel
        key={currentTranslation}
        htmlFor={inputId}
        className="start-0 max-w-[calc(100%-0.5rem)] overflow-hidden px-1 text-ellipsis whitespace-nowrap peer-focus:px-1"
      >
        {t("property.description")} {mainDescription ? `/ ${mainDescription}` : ""}
      </FloatingLabel>
    </div>
  );
});

PropertyDescriptionInput.displayName = "PropertyDescriptionInput";
