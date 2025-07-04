import { redirect } from "next/navigation";
import { getUser } from "@/entities/users/user.libs";
import { User } from "@/entities/users/user.types";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export async function AuthGuard({ children, fallback = null, redirectTo = "/login" }: AuthGuardProps) {
  const user = await getUser();

  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }
    redirect(redirectTo);
  }

  return <>{children}</>;
}

// For when you need the user object
interface AuthenticatedLayoutProps {
  children: (user: User) => React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export async function AuthenticatedLayout({
  children,
  fallback = null,
  redirectTo = "/login",
}: AuthenticatedLayoutProps) {
  const user = await getUser();

  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }
    redirect(redirectTo);
  }

  return <>{children(user)}</>;
}
