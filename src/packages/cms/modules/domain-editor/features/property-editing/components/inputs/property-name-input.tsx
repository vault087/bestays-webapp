import { memo, useCallback, useMemo } from "react";
import { FloatingInput, FloatingLabel } from "@/modules/shadcn/components/ui/floating-label-input";
import { Input } from "@/modules/shadcn/components/ui/input";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { usePropertyContext } from "@cms/modules/domain-editor/contexts";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useUncontrolledInput } from "@cms/modules/domain-editor/hooks/use-property";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store/layout.store.hooks";
import { FormProperty } from "@cms/modules/properties/form/types";

export const PropertyNameInput = memo(() => {
  useDebugRender("PropertyNameInput");

  const { t } = useCMSTranslations();
  const layoutStore = useLayoutStore();
  const canvasStore = useCanvasStore();
  const currentTranslation = layoutStore((state) => state.currentTranslation) || "";
  const currentLocale = layoutStore((state) => state.currentLocale);

  const getValue = useCallback(
    (property: FormProperty) => property.name?.[currentTranslation] || "",
    [currentTranslation],
  );
  const setValue = useCallback(
    (draft: FormProperty, value: string) => {
      if (!draft.name) draft.name = {};
      draft.name[currentTranslation] = value.trim(); //truncated space
    },
    [currentTranslation],
  );

  const { inputRef, defaultValue, onChange } = useUncontrolledInput({
    getValue,
    setValue,
    locale: currentTranslation,
  });

  const { propertyId } = usePropertyContext();
  const inputId = `property-name-input-${propertyId}-${currentTranslation}`;

  const isAdvancedSettings = layoutStore((state) => state.showAdvancedSettings);

  const mainName = useMemo(() => {
    if (currentTranslation === currentLocale) {
      return null;
    } else {
      const defaultName = canvasStore.getState().properties[propertyId].name?.[currentLocale];
      return defaultName;
    }
  }, [currentTranslation, currentLocale, propertyId, canvasStore]);

  const propertyPlaceholder = useMemo(() => {
    if (mainName) {
      return `${t("property.name")} / ${mainName}`;
    } else {
      return t("property.name");
    }
  }, [mainName, t]);

  const floatInput = useMemo(() => {
    return (
      <>
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
          className="start-0 max-w-[calc(100%-0.5rem)] px-1 peer-focus:px-1"
        >
          {propertyPlaceholder}
        </FloatingLabel>
      </>
    );
  }, [currentTranslation, inputId, inputRef, defaultValue, onChange, propertyPlaceholder]);

  const input = useMemo(() => {
    return (
      <Input
        type="text"
        ref={inputRef}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={propertyPlaceholder}
        className="h-8 bg-transparent px-1 py-0 shadow-none dark:bg-transparent"
      />
    );
  }, [inputRef, defaultValue, onChange, propertyPlaceholder]);

  return (
    <div className="relative flex w-full" key={currentTranslation}>
      {isAdvancedSettings ? floatInput : input}
    </div>
  );
});

PropertyNameInput.displayName = "PropertyNameInput";
