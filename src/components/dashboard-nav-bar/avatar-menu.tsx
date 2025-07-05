"use client";

import { ChevronDownIcon, LogOutIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { logout } from "@/entities/users/libs/auth";
import { redirect } from "@/modules/i18n";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/shadcn/components/ui/avatar";
import { Button } from "@/modules/shadcn/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/shadcn/components/ui/dropdown-menu";

export default function AvatarMenu() {
  const locale = useLocale();
  const t = useTranslations("Dashboard.NavBar");
  const user = {
    avatar: "/",
    name: "Test User",
    email: "test@test.com",
    fallback: "T",
  };

  function logoutHandler() {
    logout();
    redirect({ href: "/", locale });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src={user.avatar} alt="Profile image" />
            <AvatarFallback>{user.fallback}</AvatarFallback>
          </Avatar>
          <ChevronDownIcon size={16} className="opacity-60" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">Test User</span>
          <span className="text-muted-foreground truncate text-xs font-normal">test@test.com</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
            <span onClick={logoutHandler}>{t("Logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
