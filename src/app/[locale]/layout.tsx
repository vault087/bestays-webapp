import "@/app/globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { ThemeProvider } from "@/components/theme/components/theme-provider";
import { LocalizationProvider } from "@/modules/i18n/context/localization-provider";
import { routing } from "@/modules/i18n/core/routing";

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

  return (
    <html
      className={`${GeistSans.variable} ${GeistMono.variable} smooth-scroll`}
      lang={locale}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider>
          <LocalizationProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
            </ThemeProvider>
          </LocalizationProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
