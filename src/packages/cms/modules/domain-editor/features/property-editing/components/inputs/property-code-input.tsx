import { memo, useCallback } from "react";
import { Input } from "@/modules/shadcn/components/ui/input";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useUncontrolledInput } from "@cms/modules/domain-editor/hooks/use-property";
import { FormProperty } from "@cms/modules/properties/form/types";

export const PropertyCodeInput = memo(() => {
  useDebugRender("PropertyCodeInput");

  const getValue = useCallback((property: FormProperty) => property.code || "", []);
  const setValue = useCallback((draft: FormProperty, value: string) => {
    draft.code = value.trim();
  }, []);

  const { inputRef, defaultValue, onChange } = useUncontrolledInput({
    getValue,
    setValue,
  });

  return (
    <div className="flex w-full bg-transparent">
      <span className="border-input inline-flex h-8 items-center rounded-s-md rounded-b-none border-0 border-e-1 px-3 font-mono text-xs">
        Code
      </span>
      <Input
        type="text"
        ref={inputRef}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder="Enter code name"
        className="h-8 bg-transparent py-0 font-mono text-xs dark:bg-transparent"
      />
    </div>
  );
});

PropertyCodeInput.displayName = "PropertyCodeInput";
