"use client";

import { FormFieldLayout } from "@/components/form";
import { FormMultiOption, FormMultiOptionVariant } from "@/components/form/inputs/form-multi-option-input";
import {
  FormFieldLayoutToolbar,
  FormFieldLayoutToolbarEditButton,
} from "@/components/form/layout/form-field-layout-toolbar";
import { DBPropertyMultiCodeField, useMultiOptionField } from "@/entities/properties-sale-rent/";
import { Button } from "@/modules/shadcn/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/modules/shadcn/components/ui/dialog";

export type MultiOptionFieldProps = {
  className?: string;
  variant?: FormMultiOptionVariant | undefined;
};

export function PropertyHighlightsInput({ className, variant }: MultiOptionFieldProps) {
  return <MultiOptionField variant={variant} field="highlights" className={className} />;
}
export function PropertyLocationStrengthsInput({ className, variant }: MultiOptionFieldProps) {
  return <MultiOptionField variant={variant} field="location_strengths" className={className} />;
}
export function PropertyLandFeaturesInput({ className, variant }: MultiOptionFieldProps) {
  return <MultiOptionField variant={variant} field="land_features" className={className} />;
}
export function PropertyNearbyAttractionsInput({ className, variant }: MultiOptionFieldProps) {
  return <MultiOptionField variant={variant} field="nearby_attractions" className={className} />;
}
export function PropertyLandAndConstructionInput({ className, variant }: MultiOptionFieldProps) {
  return <MultiOptionField variant={variant} field="land_and_construction" className={className} />;
}

function MultiOptionField({
  field,
  variant = "checkbox",
  className,
}: {
  field: DBPropertyMultiCodeField;
  className?: string;
  variant?: FormMultiOptionVariant | undefined;
}) {
  const { inputId, selectedOptions, options, title, description, selectOptions, toggleOption, addOption, error } =
    useMultiOptionField({ field });

  return (
    <FormFieldLayout
      title={title}
      description={description}
      error={error}
      className={className}
      config={{ focus_ring: true }}
    >
      <FormFieldLayoutToolbar>
        <MultiOptionFieldEditDialog field={field} />
      </FormFieldLayoutToolbar>

      <FormMultiOption
        title={title}
        inputId={inputId}
        selectedOptions={selectedOptions}
        options={options}
        toggleOption={toggleOption}
        selectOptions={selectOptions}
        variant={variant}
        addOption={addOption}
      />
    </FormFieldLayout>
  );
}

export function MultiOptionFieldEditDialog({ field }: { field: DBPropertyMultiCodeField }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Delete project</Button>
        {/* <FormFieldLayoutToolbarEditButton onClick={() => {}} /> */}
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <DialogHeader>
            <DialogTitle className="sm:text-center">Final confirmation</DialogTitle>
            <DialogDescription className="sm:text-center">
              This action cannot be undone. To confirm, please enter the project name{" "}
              <span className="text-foreground">Origin UI</span>.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <div className="*:not-first:mt-2">
            {/* <Label htmlFor={id}>Project name</Label> */}
            Text Input
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </DialogClose>
            Delete Button
            {/* <Button type="button" className="flex-1" disabled={inputValue !== PROJECT_NAME}>
              Delete
            </Button> */}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
