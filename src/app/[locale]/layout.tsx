import "@/app/globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { LocalizationProvider } from "@/modules/i18n/context/localization-provider";
import { routing } from "@/modules/i18n/libs/core/routing";
import { registerLanguages } from "@/modules/i18n/utils/get-language";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  registerLanguages();

  return (
    <html
      className={`${GeistSans.variable} ${GeistMono.variable} smooth-scroll`}
      lang={locale}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider>
          <LocalizationProvider>{children}</LocalizationProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
