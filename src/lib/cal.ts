import { getBookingConfig } from "@/lib/booking";
import type { Locale } from "@/lib/i18n";

declare global {
  interface Window {
    Cal?: CalEmbedFunction;
  }
}

type CalEmbedFunction = {
  (...args: unknown[]): void;
  loaded?: boolean;
  q?: unknown[][];
  ns?: Record<string, CalEmbedFunction>;
};

const calNamespace = "defora-booking";

function queueInstruction(api: CalEmbedFunction, args: IArguments | unknown[]) {
  api.q?.push(Array.from(args));
}

function ensureCalEmbed() {
  if (window.Cal) return window.Cal;

  const cal: CalEmbedFunction = (...args) => {
    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q || [];

      const script = document.createElement("script");
      script.src = "https://app.cal.com/embed/embed.js";
      script.async = true;
      document.head.appendChild(script);

      cal.loaded = true;
    }

    if (args[0] === "init") {
      const namespace = args[1];
      const namespacedApi: CalEmbedFunction = (...namespacedArgs) => {
        queueInstruction(namespacedApi, namespacedArgs);
      };

      namespacedApi.q = namespacedApi.q || [];

      if (typeof namespace === "string") {
        cal.ns = cal.ns || {};
        cal.ns[namespace] = cal.ns[namespace] || namespacedApi;
        queueInstruction(cal.ns[namespace], args);
        queueInstruction(cal, ["initNamespace", namespace]);
        return;
      }
    }

    queueInstruction(cal, args);
  };

  cal.q = cal.q || [];
  window.Cal = cal;

  return cal;
}

export async function openBooking(locale: Locale) {
  if (typeof window === "undefined") return;

  const { calLink } = getBookingConfig(locale);
  const cal = ensureCalEmbed();

  cal("init", calNamespace, {
    origin: "https://app.cal.com",
  });

  const namespacedCal = cal.ns?.[calNamespace] ?? cal;

  namespacedCal("ui", {
    theme: "dark",
    styles: {
      branding: {
        brandColor: "#0D172B",
      },
    },
    hideEventTypeDetails: false,
  });

  namespacedCal("modal", {
    calLink,
    calOrigin: "https://app.cal.com",
    config: {
      layout: "month_view",
    },
  });
}
