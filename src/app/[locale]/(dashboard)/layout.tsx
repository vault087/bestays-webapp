import type { Metadata } from "next";
import DashboardNavBarComponent from "@/components/dashboard-nav-bar/dashboard-nav-bar";
import LocaleLayout from "@/components/layout/locale-layout";
import { ProtectedProvider } from "./provider";

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
      <ProtectedProvider>
        <div className="flex min-h-screen flex-col">
          <DashboardNavBarComponent />
          {children}
        </div>
      </ProtectedProvider>
    </LocaleLayout>
  );
}
