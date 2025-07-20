import { CheckIcon, ChevronDown } from "lucide-react";
import { memo } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Button } from "@/modules/shadcn";

export type FormDropDownOption = {
  key: string;
  label: string;
};

export const FormDropDown = memo(function FormDropDown({
  value,
  options,
  onChanged,
}: {
  value: FormDropDownOption;
  options: FormDropDownOption[];
  onChanged: (value: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="border-input bg-background text-muted-foreground inline-flex items-center rounded-s-none rounded-e-md border">
          <Button variant="text" className="flex flex-row items-center justify-center space-x-0">
            <span className="px-0 text-sm uppercase">{value.label}</span>
            <ChevronDown className="size-4" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-(--radix-dropdown-menu-trigger-width)">
        {options.map((option) => (
          <div key={option.key}>
            <DropdownMenuItem onClick={() => onChanged(option.key)} className="flex justify-between">
              <span className="text-muted-foreground text-sm uppercase">{option.label}</span>
              {option?.key === option.key && <CheckIcon size={16} className="ml-auto" />}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
