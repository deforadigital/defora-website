import { NextResponse, type NextRequest } from "next/server";
import {
  defaultLocale,
  getLocaleFromPathname,
  hasLocalePrefix,
  isLocale,
  localeCookieName,
  localizePathname,
  resolveDetectedLocale,
} from "@/lib/i18n";

function getCloudflareCountry(request: NextRequest): string | null {
  return (
    request.headers.get("cf-ipcountry") ??
    request.headers.get("CF-IPCountry") ??
    null
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameLocale = hasLocalePrefix(pathname)
    ? getLocaleFromPathname(pathname)
    : null;
  const cookieLocale = request.cookies.get(localeCookieName)?.value;

  if (hasLocalePrefix(pathname)) {
    return NextResponse.next();
  }

  const detectedLocale = resolveDetectedLocale({
    cookieLocale,
    pathnameLocale,
    acceptLanguage: request.headers.get("accept-language"),
    country: getCloudflareCountry(request),
  });

  if (isLocale(cookieLocale) && cookieLocale !== defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = localizePathname(pathname, cookieLocale);
    return NextResponse.redirect(url);
  }

  if (!cookieLocale && detectedLocale !== defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = localizePathname(pathname, detectedLocale);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
