"use client";

import { useTranslations } from "next-intl";
import { memo, ReactNode } from "react";
import { Link, usePathname } from "@/modules/i18n";
import { Button } from "@/modules/shadcn/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/modules/shadcn/components/ui/navigation-menu";
import { cn } from "@/modules/shadcn/utils/cn";

export interface DashboardLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  className?: string;
}

export const DashboardLayout = memo(function DashboardLayout({ children, sidebar, className }: DashboardLayoutProps) {
  return (
    <div className={cn("bg-background flex h-screen", className)}>
      {sidebar && <aside className="bg-background w-64 flex-shrink-0 border-r">{sidebar}</aside>}

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
});

export interface DashboardSidebarProps {
  title?: string;
  children?: ReactNode;
  className?: string;
}

export const DashboardSidebar = memo(function DashboardSidebar({ title, children, className }: DashboardSidebarProps) {
  const t = useTranslations("Dashboard");

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {title && (
        <div className="border-b p-4">
          <h1 className="text-foreground text-xl font-bold">{title}</h1>
        </div>
      )}
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
});

export interface DashboardNavigationProps {
  links: Array<{
    href: string;
    label: string;
    active?: boolean;
  }>;
  className?: string;
}

export const DashboardNavigation = memo(function DashboardNavigation({ links, className }: DashboardNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("space-y-2", className)}>
      {links.map((link) => {
        const isActive = link.active ?? pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
});
