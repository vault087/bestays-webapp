"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/modules/i18n/libs/core/navigation";
import { LOCALES, DEFAULT_LOCALE } from "@/modules/i18n/types/locale-types";
import { LocalizationContext } from "./localization-context";

export const LocalizationContextProvider = LocalizationContext.Provider;

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const currentPathnameWithoutLocale = usePathname();
  const currentSearchParams = useSearchParams();

  const switchLocale = (newLocale: string) => {
    startTransition(() => {
      const newQuery = new URLSearchParams(currentSearchParams.toString());

      const queryToPass: Record<string, string> = {};
      newQuery.forEach((value, key) => {
        queryToPass[key] = value;
      });

      router.replace(
        {
          pathname: currentPathnameWithoutLocale,
          ...(Object.keys(queryToPass).length > 0 && { query: queryToPass }),
        },
        { locale: newLocale },
      );
    });
  };

  return (
    <LocalizationContextProvider
      value={{
        locales: LOCALES,
        defaultLocale: DEFAULT_LOCALE,
        pathname: pathname,
        routeParams: params,
        switchLocale: switchLocale,
      }}
    >
      {children}
    </LocalizationContextProvider>
  );
}
