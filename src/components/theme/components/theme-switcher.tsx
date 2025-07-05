"use client";

import { MonitorCog, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { ClientOnly } from "@/components/utils/client-only";
import { Toggle } from "@/modules/shadcn";

export function ThemeSwitcher() {
  return (
    <ClientOnly>
      <ThemeSwitcherInner />
    </ClientOnly>
  );
}

export function ThemeSwitcherInner() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getAriaLabel = () => {
    switch (theme) {
      case "light":
        return "Switch to dark mode";
      case "dark":
        return "Switch to system mode";
      case "system":
        return "Switch to light mode";
      default:
        return "Switch theme";
    }
  };

  return (
    <div>
      <Toggle
        variant="outline"
        className="group data-[state=on]:hover:bg-muted size-9 data-[state=on]:bg-transparent"
        pressed={theme !== "light"}
        onPressedChange={cycleTheme}
        aria-label={getAriaLabel()}
      >
        {/* Light theme icon */}
        <SunIcon
          size={16}
          className={`shrink-0 transition-all ${
            theme === "light" ? "scale-100 opacity-100" : "absolute scale-0 opacity-0"
          }`}
          aria-hidden="true"
        />
        {/* Dark theme icon */}
        <MoonIcon
          size={16}
          className={`shrink-0 transition-all ${
            theme === "dark" ? "scale-100 opacity-100" : "absolute scale-0 opacity-0"
          }`}
          aria-hidden="true"
        />
        {/* System theme icon */}
        <MonitorCog
          size={16}
          className={`shrink-0 transition-all ${
            theme === "system" ? "scale-100 opacity-100" : "absolute scale-0 opacity-0"
          }`}
          aria-hidden="true"
        />
      </Toggle>
    </div>
  );
}
