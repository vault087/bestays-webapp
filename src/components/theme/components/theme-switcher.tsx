"use client";

import { MonitorCog, MoonIcon, SunIcon, CheckIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { ClientOnly } from "@/components/utils/client-only";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/modules/shadcn";

export function ModeSwitcher() {
  return (
    <ClientOnly>
      <ModeSwitcherInner />
    </ClientOnly>
  );
}

export function ModeSwitcherInner() {
  const { theme, setTheme } = useTheme();

  const options: {
    label: string;
    theme: string;
    icon: React.ReactNode;
    checked: boolean;
  }[] = [
    {
      label: "Light",
      theme: "light",
      icon: <SunIcon size={16} aria-hidden="true" />,
      checked: theme === "light",
    },
    {
      label: "Dark",
      theme: "dark",
      icon: <MoonIcon size={16} aria-hidden="true" />,
      checked: theme === "dark",
    },
    {
      label: "System",
      theme: "system",
      icon: <MonitorCog size={16} aria-hidden="true" />,
      checked: theme === "system",
    },
  ];

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" aria-label="Select theme" className="hover:cursor-pointer">
            {theme === "light" && <SunIcon size={16} aria-hidden="true" />}
            {theme === "dark" && <MoonIcon size={16} aria-hidden="true" />}
            {theme === "system" && <MonitorCog size={16} aria-hidden="true" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-32">
          {options.map((option) => (
            <DropdownMenuItem
              key={option.theme}
              onClick={() => setTheme(option.theme)}
              className="flex justify-between"
            >
              <div className="flex items-center gap-2">
                {option.icon}
                <span>{option.label}</span>
              </div>
              {option.checked && <CheckIcon className="text-foreground" size={16} aria-hidden="true" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
