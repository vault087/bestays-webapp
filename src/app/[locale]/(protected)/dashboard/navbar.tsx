"use client";

import { redirect } from "next/navigation";
import { logout } from "@cms/modules/users/auth.actions";

export default function NavBar() {
  async function logoutHandler() {
    await logout();
    redirect("/login");
  }
  return (
    <div className="flex items-center justify-end p-4">
      <div className="group flex flex-row items-center justify-end gap-2">
        <button
          className="text-primary flex flex-row items-center justify-center gap-2 text-sm font-medium transition-all duration-150 group-hover:cursor-pointer group-hover:text-amber-600"
          onClick={logoutHandler}
        >
          Logout
        </button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="text-primary h-5 w-5 transition-all duration-150 group-hover:text-amber-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
          />
        </svg>
      </div>
    </div>
  );
}
