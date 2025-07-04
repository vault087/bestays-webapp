"use client";

import { Globe, ChevronDown, CheckIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { ClientOnly } from "@/components/utils/client-only";
import { useLocalization } from "@/modules/i18n/context/localization-context";
import { Button } from "@/modules/shadcn/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/shadcn/components/ui/dropdown-menu";

export default function LocaleSwitcher() {
  return (
    <ClientOnly>
      <LocaleSwitcherInner />
    </ClientOnly>
  );
}

function LocaleSwitcherInner() {
  const { locales: contextLocales, switchLocale } = useLocalization();
  const currentLocale = useLocale();

  if (!currentLocale || !contextLocales || typeof switchLocale !== "function") {
    // Optionally return a loader or null, or rely on ClientOnly and context readiness
    return null;
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            aria-label="Select language"
            className="-px-2 -mr-2 flex items-center gap-1 hover:cursor-pointer"
          >
            <Globe size={16} aria-hidden="true" />
            <span>{currentLocale.toUpperCase()}</span>
            <ChevronDown size={16} aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[80px]">
          {contextLocales.map((locale) => (
            <DropdownMenuItem
              key={locale}
              onClick={() => switchLocale(locale)}
              className="flex items-center justify-between"
            >
              <span className="flex items-center gap-2">{locale.toUpperCase()}</span>
              {currentLocale === locale && <CheckIcon className="text-foreground" size={16} aria-hidden="true" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
