import type { Metadata } from "next";
import { type Locale, localizePathname } from "@/lib/i18n";

const siteUrl = "https://defora.digital";

export function createLocalizedMetadata({
  locale,
  pathname,
  title,
  description,
}: {
  locale: Locale;
  pathname: string;
  title: string;
  description: string;
}): Metadata {
  const canonicalPath = localizePathname(pathname, locale);

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        tr: localizePathname(pathname, "tr"),
        en: localizePathname(pathname, "en"),
        "x-default": localizePathname(pathname, "tr"),
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: "Defora Digital",
      locale: locale === "tr" ? "tr_TR" : "en_US",
      alternateLocale: locale === "tr" ? ["en_US"] : ["tr_TR"],
      type: "website",
    },
  };
}
