import { CheckIcon, ChevronDown } from "lucide-react";
import { memo } from "react";
import { FormSingleOptionProps } from "@/components/form/types";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Button } from "@/modules/shadcn";

export const FormDropDown = memo(function FormDropDown({
  selectedOption,
  options,
  selectOption,
  placeholder,
}: FormSingleOptionProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="border-input bg-background text-muted-foreground inline-flex items-center rounded-s-none rounded-e-md border">
          <Button variant="text" className="flex flex-row items-center justify-center space-x-0">
            {selectedOption && <span className="px-0 text-sm uppercase">{selectedOption.label}</span>}
            {!selectedOption && placeholder && <span className="px-0 text-sm uppercase">{placeholder}</span>}
            <ChevronDown className="size-4" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-(--radix-dropdown-menu-trigger-width)">
        {options.map((option) => (
          <div key={option.key}>
            <DropdownMenuItem onClick={() => selectOption(option)} className="flex justify-between">
              <span className="text-muted-foreground text-sm uppercase">{option.label}</span>
              {option?.key === option.key && <CheckIcon size={16} className="ml-auto" />}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
