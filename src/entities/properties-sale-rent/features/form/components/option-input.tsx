"use client";

import { FormFieldLayout, FormOptionInput, FormOptionVariant } from "@/components/form";
import {
  FormFieldLayoutToolbar,
  FormFieldLayoutToolbarEditButton,
} from "@/components/form/layout/form-field-layout-toolbar";
import { DictionaryEntryEditor } from "@/entities/dictionaries/features/form/components/blocks/dictionary-entry-editor";
import { useDictionaryFormStore } from "@/entities/dictionaries/features/form/store";
import { DBPropertyCodeField, DBPropertyMultiCodeField } from "@/entities/properties-sale-rent/";
import { useOptionField } from "@/entities/properties-sale-rent/features/form/hooks/use-option-field";
import { useDictionaryOptions } from "@/entities/properties-sale-rent/features/form/hooks/utils/use-dictionary-options";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/modules/shadcn/components/ui/dialog";

export type OptionFieldProps = {
  className?: string;
  variant?: FormOptionVariant | undefined;
};
// Single CodeUncontrolled Input
export function PropertyAreaInput({ className, variant }: OptionFieldProps) {
  return <PropertyOptionField variant={variant} field="area" className={className} />;
}
export function PropertyDivisibleSaleInput({ className, variant }: OptionFieldProps) {
  return <PropertyOptionField variant={variant} field="divisible_sale" className={className} />;
}
export function PropertyOwnershipTypeInput({ className, variant }: OptionFieldProps) {
  return <PropertyOptionField variant={variant} field="ownership_type" className={className} />;
}
export function PropertyPropertyTypeInput({ className, variant }: OptionFieldProps) {
  return <PropertyOptionField variant={variant} field="property_type" className={className} />;
}

export function PropertyOptionField({
  field,
  className,
  variant = "select",
}: OptionFieldProps & { field: DBPropertyCodeField }) {
  const { inputId, selectedOption, options, title, description, selectOption, error, addOption } = useOptionField({
    field,
  });

  return (
    <FormFieldLayout
      title={title}
      description={description}
      error={error}
      className={className}
      config={{ focus_ring: true, description: { position: "bottom" } }}
    >
      <FormFieldLayoutToolbar>
        <OptionFieldEditDialog field={field} />
      </FormFieldLayoutToolbar>

      <FormOptionInput
        inputId={inputId}
        selectedOption={selectedOption}
        options={options}
        selectOption={selectOption}
        variant={variant}
        addOption={addOption}
      />
    </FormFieldLayout>
  );
}

export function OptionFieldEditDialog({ field }: { field: DBPropertyCodeField | DBPropertyMultiCodeField }) {
  const { dictionary, locale } = useDictionaryOptions({ field });
  // Get mutable entries from dictionary store instead
  const entries = useDictionaryFormStore((state) => (dictionary?.id ? state.entries[dictionary.id] : undefined));

  if (!dictionary || !entries) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <FormFieldLayoutToolbarEditButton onClick={() => {}} />
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogTitle className="sr-only">Manage {dictionary.name?.[locale] || dictionary.code} Options</DialogTitle>
        <DictionaryEntryEditor
          dictionary={dictionary}
          entries={entries}
          locale={locale}
          onClose={() => {
            // Dialog will close automatically when trigger loses focus
            document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
