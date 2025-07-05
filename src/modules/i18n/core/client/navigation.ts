import { createNavigation } from "next-intl/navigation";
import { routing } from "@/modules/i18n/core/routing";

// Lightweight wrappers around Next.js' navigation
// APIs that consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
