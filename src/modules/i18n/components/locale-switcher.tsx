"use client";

import { CheckIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { ClientOnly } from "@/components/utils/client-only";
import { useLocalization } from "@/modules/i18n/context/localization-context";
import { getFlagComponent } from "@/modules/i18n/types/locale-types";
import { getLanguageName } from "@/modules/i18n/utils/get-language";
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

  const CurrentFlag = getFlagComponent(currentLocale);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" aria-label="Select language" className="flex items-center pr-2 hover:cursor-pointer">
            <div className="flex items-center space-x-1.5">
              <CurrentFlag className="h-3 w-4" aria-hidden="true" />
              <span className="text-sm capitalize">{getLanguageName(currentLocale, currentLocale)}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[80px]">
          {contextLocales.map((locale) => {
            const FlagComponent = getFlagComponent(locale);
            return (
              <DropdownMenuItem
                key={locale}
                onClick={() => switchLocale(locale)}
                className="flex items-center justify-between"
              >
                <span className="flex items-center gap-2 capitalize">
                  <FlagComponent className="h-3 w-4" />
                  {getLanguageName(locale, locale)}
                </span>
                {currentLocale === locale && <CheckIcon className="text-foreground" size={16} aria-hidden="true" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
