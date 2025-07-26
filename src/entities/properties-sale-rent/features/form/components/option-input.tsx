"use client";
import { EllipsisVerticalIcon, SquarePenIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo, useState } from "react";
import { FormFieldLayout, FormOptionInput, FormOptionVariant } from "@/components/form";
// import { FormFieldLayoutToolbar } from "@/components/form/layout/form-field-layout-toolbar";
import { DictionaryEntryEditor } from "@/entities/dictionaries/features/form/components/blocks/dictionary-entry-editor";
import { useDictionaryFormStore } from "@/entities/dictionaries/features/form/store";
import { getAvailableLocalizedText } from "@/entities/localized-text";
import { DBPropertyCodeField, DBPropertyMultiCodeField, usePropertyLocale } from "@/entities/properties-sale-rent/";
import { useOptionField } from "@/entities/properties-sale-rent/features/form/hooks/use-option-field";
import { useDictionaryOptions } from "@/entities/properties-sale-rent/features/form/hooks/utils/use-dictionary-options";
import {
  Button,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuGroup,
  cn,
} from "@/modules/shadcn";
import { Dialog, DialogContent, DialogTitle } from "@/modules/shadcn/components/ui/dialog";

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
  const {
    inputId,
    selectedOption,
    isAddingOption,
    title,
    description,
    options,
    selectOption,
    dictionary,
    error,
    addOption,
  } = useOptionField({
    field,
  });

  const locale = usePropertyLocale();

  console.log("re-render");
  return (
    <FormFieldLayout
      title={title}
      description={description}
      error={error}
      className={className}
      config={{ focus_ring: true }}
    >
      {/* <FormFieldLayoutToolbar>
        <FieldDropDownMenu field={field} />
      </FormFieldLayoutToolbar> */}

      <FormOptionInput
        inputId={inputId}
        selectedOption={selectedOption}
        isAddingOption={isAddingOption}
        options={options}
        selectOption={selectOption}
        variant={variant}
        addOption={
          addOption && { ...addOption, label: getAvailableLocalizedText(dictionary?.name, locale).toLocaleLowerCase() }
        }
      />
    </FormFieldLayout>
  );
}
export const FieldDropDownMenu = memo(function FieldDropDownMenu({
  field,
}: {
  field: DBPropertyCodeField | DBPropertyMultiCodeField;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const t = useTranslations("Common");
  const handleEditClick = () => {
    setDropdownOpen(false);
    setDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-primary hover:bg-transparent"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <EllipsisVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-(--radix-dropdown-menu-trigger-width)">
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={handleEditClick}>
              <SquarePenIcon className="h-4 w-4" />
              {t("edit")}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <FieldMenuDialog field={field} open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
});

export function FieldMenuDialog({
  field,
  open,
  onOpenChange,
  className,
}: {
  field: DBPropertyCodeField | DBPropertyMultiCodeField;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}) {
  const { dictionary, locale } = useDictionaryOptions({ field });
  // Get mutable entries from dictionary store instead
  const entries = useDictionaryFormStore((state) => (dictionary?.id ? state.entries[dictionary.id] : undefined));

  if (!dictionary || !entries) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-w-[90vw] px-12", className)}>
        <DialogTitle className="sr-only">Manage {dictionary.name?.[locale] || dictionary.code} Options</DialogTitle>
        <DictionaryEntryEditor
          dictionary={dictionary}
          entries={entries}
          locale={locale}
          onClose={() => {
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
