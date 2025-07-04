import type { Metadata } from "next";
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
    <div>
      <ProtectedProvider>{children}</ProtectedProvider>
    </div>
  );
}
