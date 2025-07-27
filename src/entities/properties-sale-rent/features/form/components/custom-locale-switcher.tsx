"use client";
import { memo } from "react";
import { useLocalization } from "@/modules/i18n/context";
import { getFlagComponent } from "@/modules/i18n/types/locale-types";
import { Button, cn } from "@/modules/shadcn";

export const CustomLocaleSwitcher = memo(function CustomLocaleSwitcher({
  locale,
  customLocale,
  setCustomLocale,
}: {
  locale: string;
  customLocale: string;
  setCustomLocale: (locale: string) => void;
}) {
  const { locales } = useLocalization();
  const sortedLocales: string[] = [locale, ...locales.filter((l) => l !== locale)];

  return (
    <div className="justify-right flex flex-row content-center space-x-0">
      {sortedLocales.map((locale) => {
        const FlagComponent = getFlagComponent(locale);
        return (
          <div key={locale} className={cn("", customLocale === locale && "ring-primary/50 rounded-sm ring-1")}>
            <Button variant="text" onClick={() => setCustomLocale(locale)}>
              <FlagComponent className={cn("h-3 w-4")} />
            </Button>
          </div>
        );
      })}
    </div>
  );
});
