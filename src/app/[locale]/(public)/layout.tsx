import "@/app/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bestays",
  description: "Best Stays App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}
