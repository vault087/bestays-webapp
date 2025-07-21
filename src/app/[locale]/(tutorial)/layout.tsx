import type { Metadata } from "next";
import RootLayout from "@/components/layout/root-layout";

export const metadata: Metadata = {
  title: "Bestays",
  description: "Best Stays App",
};

export default async function Layout({
  params,
  children,
}: Readonly<{
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}>) {
  return (
    <RootLayout params={params}>
      <main>{children}</main>
    </RootLayout>
  );
}
