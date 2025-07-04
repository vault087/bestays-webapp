import { NextFetchEvent, type NextRequest } from "next/server";
import { NextMiddleware } from "next/server";
import createMiddleware from "next-intl/middleware";
import { createMiddlewareChain } from "./libs";
import { LOCALES, DEFAULT_LOCALE } from "./modules/i18n/types/locale-types";
import { updateSession } from "./modules/supabase/middleware/updateSession";

const handleI18nRouting = createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
});

export default createMiddlewareChain([NextIntlMiddleware, UpdateSessionMiddleware]);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
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
