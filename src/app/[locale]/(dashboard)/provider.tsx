import { Metadata } from "next";
import { type ReactNode } from "react";
import * as React from "react";
import { AuthGuard } from "@/components/auth/auth-guard";

export const metadata: Metadata = {
  title: "Bestays Dashboard",
  description: "Best Stays App",
};

export function ProtectedProvider({ children }: { children: ReactNode }): ReactNode {
  return <AuthGuard>{children}</AuthGuard>;
}
