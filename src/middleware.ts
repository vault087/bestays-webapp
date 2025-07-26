import { NextFetchEvent, type NextRequest, NextResponse } from "next/server";
import { NextMiddleware } from "next/server";
import createMiddleware from "next-intl/middleware";
import { createMiddlewareChain } from "./libs";
import { LOCALES, DEFAULT_LOCALE } from "./modules/i18n/types/locale-types";
import { getSupabase } from "./modules/supabase/clients/client.server";
import { updateSession } from "./modules/supabase/middleware/updateSession";

const handleI18nRouting = createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
});

export default createMiddlewareChain([AuthMiddleware, NextIntlMiddleware, UpdateSessionMiddleware]);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

function NextIntlMiddleware(middleware: NextMiddleware): NextMiddleware {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = handleI18nRouting(request);
    if (response) return response;
    return middleware(request, event);
  };
}

function UpdateSessionMiddleware(middleware: NextMiddleware): NextMiddleware {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = await updateSession(request);
    if (response) return response;
    return middleware(request, event);
  };
}

function AuthMiddleware(middleware: NextMiddleware): NextMiddleware {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const { pathname } = request.nextUrl;

    // Define protected routes
    const protectedRoutes = ["/dashboard"];
    const authRoutes = ["/login", "/register"];

    const isProtectedRoute = protectedRoutes.some((route) => pathname.includes(route));
    const isAuthRoute = authRoutes.some((route) => pathname.includes(route));

    if (isProtectedRoute || isAuthRoute) {
      const supabase = await getSupabase();

      // Add error handling and session validation
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth error:", error);
        // Decide whether to allow or deny access on error
      }

      if (isProtectedRoute && !session) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
      }

      if (isAuthRoute && session) {
        const dashboardUrl = new URL("/dashboard", request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }

    return middleware(request, event);
  };
}
