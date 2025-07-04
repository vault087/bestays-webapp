import { Metadata } from "next";
import { type ReactNode } from "react";
import * as React from "react";
import { ThemeProvider } from "@/components/theme/components/theme-provider";
import { AuthGuard } from "@/components/auth/auth-guard";

export const metadata: Metadata = {
  title: "Bestays Dashboard",
  description: "Best Stays App",
};

export function ProtectedProvider({ children }: { children: ReactNode }): ReactNode {
  return (
    <AuthGuard>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </AuthGuard>
  );
}
