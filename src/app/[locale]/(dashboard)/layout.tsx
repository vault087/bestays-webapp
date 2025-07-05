import type { Metadata } from "next";
import DashboardNavBarComponent from "@/components/dashboard-nav-bar/dashboard-nav-bar";
import { ProtectedProvider } from "./provider";

export const metadata: Metadata = {
  title: "Bestays",
  description: "Best Stays App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedProvider>
      <div className="flex min-h-screen flex-col">
        <DashboardNavBarComponent />
        {children}
      </div>
    </ProtectedProvider>
  );
}
