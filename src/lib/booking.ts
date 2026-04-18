import type { Locale } from "@/lib/i18n";

export type BookingConfig = {
  calLink: string;
};

export const bookingConfigByLocale: Record<Locale, BookingConfig> = {
  tr: {
    calLink:
      process.env.NEXT_PUBLIC_CAL_LINK_TR ||
      "deforadigital/strateji-gorusmesi",
  },
  en: {
    calLink:
      process.env.NEXT_PUBLIC_CAL_LINK_EN || "deforadigital/strategy-call",
  },
};

export function getBookingConfig(locale: Locale): BookingConfig {
  return bookingConfigByLocale[locale];
}
