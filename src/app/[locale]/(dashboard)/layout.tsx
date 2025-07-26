import type { Metadata } from "next";
import RootLayout from "@/components/layout/root-layout";

export const metadata: Metadata = {
  title: "Bestays",
  description: "Best Stays App",
};

export default async function DashboardLayout({
  params,
  children,
}: Readonly<{
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}>) {
  return (
    <RootLayout params={params}>
      <div className="flex min-h-screen flex-col">{children}</div>
    </RootLayout>
  );
}
