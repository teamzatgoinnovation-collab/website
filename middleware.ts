import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/",
    "/(en|hi|ur|ar|ml|es|zh|ja|tr)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
