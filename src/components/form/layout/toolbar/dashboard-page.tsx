"use client";

import { memo, ReactNode } from "react";
import { cn } from "@/modules/shadcn/utils/cn";
import { DashboardToolbar, DashboardToolbarProps } from "../dashboard-toolbar";

export interface DashboardPageProps {
  children: ReactNode;
  toolbar?: ReactNode;
  toolbarProps?: Omit<DashboardToolbarProps, "children">;
  className?: string;
}

export const DashboardPage = memo(function DashboardPage({
  children,
  toolbar,
  toolbarProps,
  className,
}: DashboardPageProps) {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      {toolbar && <DashboardToolbar {...toolbarProps}>{toolbar}</DashboardToolbar>}

      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
});

export interface DashboardPageContentProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export const DashboardPageContent = memo(function DashboardPageContent({
  children,
  className,
  maxWidth = "full",
}: DashboardPageContentProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-none",
  };

  return (
    <div className={cn("p-6", className)}>
      <div className={cn("mx-auto", maxWidthClasses[maxWidth])}>{children}</div>
    </div>
  );
});
