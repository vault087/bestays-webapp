"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ThemeSwitcher } from "@/components/theme";
import { Link, usePathname } from "@/modules/i18n";
import LocaleSwitcher from "@/modules/i18n/components/locale-switcher";
import {
  Button,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/shadcn/components";
import Comp521 from "@/modules/shadcn/components/comp-521";
import AvatarMenu from "./avatar-menu";

const Logo = () => {
  return (
    <div>
      <Link href="/" className="text-primary hover:text-primary/90">
        <div className="group flex items-center space-x-2">
          <Image
            src="/bestays-logo-transparent.png"
            alt="logo"
            width={32}
            height={32}
            className="dark:contrast- contrast-125 saturate-125 transition-all duration-300 group-hover:opacity-80 dark:invert"
          />
        </div>
      </Link>
    </div>
  );
};

export default function DashboardNavBar() {
  const t = useTranslations("Dashboard.NavBar");

  const pathname = usePathname();
  const isActive = (href: string) => {
    return pathname === href;
  };
  // Navigation links array to be used in both desktop and mobile menus
  const navigationLinks = [
    { href: "/dashboard/properties-sell-rent", label: t("Listings") },
    { href: "/dashboard/dictionaries", label: t("Settings") },
  ];
  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}

        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <PopoverMenu navigationLinks={navigationLinks} isActive={isActive} />
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <Logo />
          </div>

          <div className="flex items-center justify-center gap-2 pl-4">
            {/* Navigation menu */}
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      active={isActive(link.href)}
                      href={link.href}
                      className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="min-w-sm pt-4">
          <Comp521 />
        </div>
        {/* Right side */}
        <div className="flex items-center justify-end space-x-3">
          <LocaleSwitcher />
          <ThemeSwitcher />
          <AvatarMenu />
        </div>
      </div>
    </header>
  );
}

function PopoverMenu({
  navigationLinks,
  isActive,
}: {
  navigationLinks: { href: string; label: string }[];
  isActive: (href: string) => boolean;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="group size-8 md:hidden" variant="ghost" size="icon">
          <svg
            className="pointer-events-none"
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 12L20 12"
              className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
            />
            <path
              d="M4 12H20"
              className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
            />
            <path
              d="M4 12H20"
              className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
            />
          </svg>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-36 p-1 md:hidden">
        <NavigationMenu className="max-w-none *:w-full">
          <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
            {navigationLinks.map((link, index) => (
              <NavigationMenuItem key={index} className="w-full">
                <NavigationMenuLink href={link.href} className="py-1.5" active={isActive(link.href)}>
                  {link.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </PopoverContent>
    </Popover>
  );
}
