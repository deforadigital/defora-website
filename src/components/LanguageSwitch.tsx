"use client";

import { usePathname } from "next/navigation";
import { type Locale, defaultLocale, localizePathname } from "@/lib/i18n";

const languageOptions: Array<{ locale: Locale; label: string }> = [
  { locale: "tr", label: "TR" },
  { locale: "en", label: "EN" },
];

export default function LanguageSwitch({
  locale,
  className = "",
}: {
  locale: Locale;
  className?: string;
}) {
  const pathname = usePathname();

  const handleSwitch = async (targetLocale: Locale) => {
    const nextPathname = localizePathname(pathname || "/", targetLocale);
    const suffix = `${window.location.search}${window.location.hash}`;

    await fetch("/api/lang", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ locale: targetLocale }),
    });

    window.location.assign(`${nextPathname}${suffix}`);
  };

  return (
    <div
      aria-label="Language switcher"
      className={`inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/45 ${className}`}
    >
      {languageOptions.map(({ locale: optionLocale, label }, index) => {
        const isActive =
          locale === optionLocale ||
          (locale === defaultLocale && optionLocale === defaultLocale);

        return (
          <span key={optionLocale} className="inline-flex items-center gap-2">
            <button
              type="button"
              aria-pressed={isActive}
              onClick={() => handleSwitch(optionLocale)}
              className={`transition duration-500 ease-out hover:text-white ${
                isActive ? "text-white" : "text-white/45"
              }`}
            >
              {label}
            </button>
            {index < languageOptions.length - 1 ? (
              <span aria-hidden="true" className="text-white/25">
                |
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}
