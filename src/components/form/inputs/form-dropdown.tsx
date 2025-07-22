import { CheckIcon, ChevronDown } from "lucide-react";
import { memo } from "react";
import { FormSingleOptionProps } from "@/components/form/types";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Button } from "@/modules/shadcn";
import { cn } from "@/modules/shadcn/utils/cn";

export const FormDropDown = memo(function FormDropDown({
  selectedOption,
  options,
  selectOption,
  placeholder,
  className,
}: FormSingleOptionProps & { className?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            "bg-background text-muted-foreground border-input inline-flex items-center rounded-md border",
            className,
          )}
        >
          <Button variant="text" className="flex flex-row items-center justify-center space-x-0">
            {selectedOption && <span className="px-0 text-sm uppercase">{selectedOption.label}</span>}
            {!selectedOption && placeholder && <span className="px-0 text-sm uppercase">{placeholder}</span>}
            {options.length > 1 && <ChevronDown className="size-4" />}
          </Button>
        </div>
      </DropdownMenuTrigger>
      {options.length > 1 && (
        <DropdownMenuContent className="min-w-(--radix-dropdown-menu-trigger-width)">
          {options.map((option) => (
            <div key={option.key}>
              <DropdownMenuItem onClick={() => selectOption(option)} className="flex justify-between">
                <span className="text-muted-foreground text-sm uppercase">{option.label}</span>
                {option?.key === selectedOption?.key && <CheckIcon size={16} className="ml-auto" />}
              </DropdownMenuItem>
            </div>
          ))}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
});
