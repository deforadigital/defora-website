export const locales = ["tr", "en"] as const;
export const defaultLocale = "tr";
export const localeCookieName = "lang";
export const localeCookieMaxAge = 60 * 60 * 24 * 365;

export type Locale = (typeof locales)[number];

const localizedRoutePattern = /^\/([a-z]{2})(?=\/|$)/;
const turkishCountries = new Set(["TR", "CY"]);

export function isLocale(value: string | undefined | null): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const match = pathname.match(localizedRoutePattern);

  if (!match) return defaultLocale;

  return isLocale(match[1]) ? match[1] : null;
}

export function hasLocalePrefix(pathname: string): boolean {
  const match = pathname.match(localizedRoutePattern);

  return Boolean(match && isLocale(match[1]));
}

export function stripLocalePrefix(pathname: string): string {
  const match = pathname.match(localizedRoutePattern);

  if (!match || !isLocale(match[1])) return pathname || "/";

  const stripped = pathname.slice(match[0].length);
  return stripped || "/";
}

export function localizePathname(pathname: string, locale: Locale): string {
  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const pathWithoutLocale = stripLocalePrefix(normalizedPathname);

  if (locale === defaultLocale) return pathWithoutLocale;
  if (pathWithoutLocale === "/") return `/${locale}`;

  return `/${locale}${pathWithoutLocale}`;
}

export function getLocaleFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;

  const languages = header
    .split(",")
    .map((part) => {
      const [tag, quality] = part.trim().split(";q=");
      return {
        tag: tag.toLowerCase(),
        quality: quality ? Number.parseFloat(quality) : 1,
      };
    })
    .filter(({ tag, quality }) => tag && !Number.isNaN(quality))
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of languages) {
    const primary = tag.split("-")[0];

    if (primary === "tr") return "tr";
    if (primary === "en") return "en";
  }

  return null;
}

export function getLocaleFromCountry(country: string | null): Locale | null {
  if (!country) return null;

  const normalizedCountry = country.toUpperCase();

  if (turkishCountries.has(normalizedCountry)) return "tr";
  if (normalizedCountry === "XX" || normalizedCountry === "T1") return null;

  return "en";
}

export function resolveDetectedLocale({
  cookieLocale,
  pathnameLocale,
  acceptLanguage,
  country,
}: {
  cookieLocale?: string | null;
  pathnameLocale?: Locale | null;
  acceptLanguage?: string | null;
  country?: string | null;
}): Locale {
  if (isLocale(cookieLocale)) return cookieLocale;
  if (pathnameLocale) return pathnameLocale;

  return (
    getLocaleFromAcceptLanguage(acceptLanguage ?? null) ??
    getLocaleFromCountry(country ?? null) ??
    defaultLocale
  );
}

export function getCanonicalPath(pathname: string, locale: Locale): string {
  return localizePathname(pathname, locale);
}
