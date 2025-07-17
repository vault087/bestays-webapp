// app/layout.tsx (create this file)
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bestays",
  description: "Best Stays App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
