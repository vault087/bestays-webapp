import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bestays Auth",
  description: "Best Stays App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}
