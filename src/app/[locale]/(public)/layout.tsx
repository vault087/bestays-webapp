import type { Metadata } from "next";
import LocaleLayout from "@/components/layout/locale-layout";

export const metadata: Metadata = {
  title: "Bestays",
  description: "Best Stays App",
};

export default async function RootLayout({
  params,
  children,
}: Readonly<{
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}>) {
  return (
    <LocaleLayout params={params}>
      <main>{children}</main>
    </LocaleLayout>
  );
}
