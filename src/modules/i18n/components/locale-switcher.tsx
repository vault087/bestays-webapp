"use client";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { QuickTooltip } from "@/components/ui/quick-tooltip";
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

export default function LocaleSwitcher({ variant = "icon" }: { variant?: "default" | "icon" }) {
  return (
    <ClientOnly>
      <LocaleSwitcherInner variant={variant} />
    </ClientOnly>
  );
}

function LocaleSwitcherInner({ variant }: { variant: "default" | "icon" }) {
  const { locales: contextLocales, switchLocale } = useLocalization();
  const currentLocale = useLocale();
  const t = useTranslations("UI.Tooltips");

  if (!currentLocale || !contextLocales || typeof switchLocale !== "function") {
    // Optionally return a loader or null, or rely on ClientOnly and context readiness
    return null;
  }

  const CurrentFlag = getFlagComponent(currentLocale);

  return (
    <div>
      <DropdownMenu>
        <QuickTooltip content={t("SelectLanguage")}>
          <div>
            <DropdownMenuTrigger asChild>
              <div>
                {variant === "default" && (
                  <Button
                    variant="ghost"
                    aria-label="Select language"
                    className="flex items-center pr-2 hover:cursor-pointer"
                  >
                    <div className="flex items-center space-x-1.5">
                      <CurrentFlag className="h-3 w-4" aria-hidden="true" />
                      <span className="text-sm capitalize">{getLanguageName(currentLocale, currentLocale)}</span>
                    </div>
                  </Button>
                )}
                {variant === "icon" && (
                  <Button variant="outline" aria-label="Select language" className="flex items-center pr-2">
                    <CurrentFlag className="h-3 w-4" aria-hidden="true" />
                    <ChevronDownIcon size={16} className="opacity-60" aria-hidden="true" />
                  </Button>
                )}
              </div>
            </DropdownMenuTrigger>
          </div>
        </QuickTooltip>
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
