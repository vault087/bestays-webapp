import { type ReactNode } from "react";
import * as React from "react";
import { AuthGuard } from "@/components/auth/auth-guard";

export function ProtectedProvider({ children }: { children: ReactNode }): ReactNode {
  return <AuthGuard>{children}</AuthGuard>;
}
