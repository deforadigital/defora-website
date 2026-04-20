"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import gsap from "gsap";
import { openBooking } from "@/lib/cal";
import type { Locale } from "@/lib/i18n";

/** Swiss-style sans for hero copy (Suisse Intl is proprietary; Inter + system neo-grotesks). */
const heroSans = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600"],
  adjustFontFallback: true,
});

const heroCopy: Record<
  Locale,
  {
    label: string;
    focusLabel: string;
    headline: string[];
    cta: string;
    whatsappCta: string;
    phoneCta: string;
    whatsappMessage: string;
  }
> = {
  tr: {
    label: "STRATEJİ · TASARIM · GELİŞTİRME · PERFORMANS",
    focusLabel: "Odak alanlarımız",
    headline: ["Dijital ürünleri değil,", "çalışan sistemleri inşa ediyoruz."],
    cta: "Ücretsiz görüşme planla",
    whatsappCta: "WhatsApp’tan yaz",
    phoneCta: "Telefon ile ara",
    whatsappMessage: "Merhaba, projem hakkında görüşmek istiyorum.",
  },
  en: {
    label: "STRATEGY · DESIGN · DEVELOPMENT · PERFORMANCE",
    focusLabel: "Focus areas",
    headline: ["We don’t build pages.", "We build systems that perform."],
    cta: "Book a consultation",
    whatsappCta: "WhatsApp us",
    phoneCta: "Call us",
    whatsappMessage: "I’d like to discuss a project.",
  },
};

const contactLinks: Record<Locale, { phoneHref: string; whatsappHref: string }> = {
  tr: {
    phoneHref: "tel:05400333672",
    whatsappHref: "https://wa.me/905400333672",
  },
  en: {
    phoneHref: "tel:+15716006092",
    whatsappHref: "https://wa.me/15716006092",
  },
};

export default function Hero({ locale }: { locale: Locale }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const logoWrapRef = useRef<HTMLDivElement | null>(null);
  const introLockupRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const eyebrowTrackRef = useRef<HTMLParagraphElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const ctaGroupRef = useRef<HTMLDivElement | null>(null);
  const ghostRef = useRef<HTMLDivElement | null>(null);
  const copy = heroCopy[locale];
  const labelParts = copy.label.split(" · ");
  const focusWords = labelParts;
  const phoneHref = contactLinks[locale].phoneHref;
  const whatsappHref =
    locale === "tr"
      ? `${contactLinks.tr.whatsappHref}?text=${encodeURIComponent(copy.whatsappMessage)}`
      : contactLinks.en.whatsappHref;

  const handleBookingAction = () => {
    void openBooking(locale);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const logo = logoRef.current;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      if (!logo) return;

      gsap.set(overlayRef.current, {
        autoAlpha: 1,
        yPercent: 0,
      });

      gsap.set(logoWrapRef.current, {
        autoAlpha: 1,
      });

      gsap.set(introLockupRef.current, {
        scale: 0.18,
        autoAlpha: 1,
        transformOrigin: "50% 50%",
      });

      gsap.set(logo, {
        autoAlpha: 0,
        scale: 0.82,
        y: 10,
        transformOrigin: "50% 50%",
      });

      gsap.set(labelRef.current, {
        autoAlpha: 1,
      });

      gsap.set(ghostRef.current, {
        autoAlpha: 0,
        x: prefersReducedMotion ? 0 : 26,
      });

      const overlayOutAt = isMobile ? 0.78 : 1.08;
      const overlayOutDuration = isMobile ? 1.05 : 1.75;
      const logoInDuration = isMobile ? 0.85 : 1.2;
      const logoOutAt = isMobile ? 0.82 : 1.18;
      const logoOutDuration = isMobile ? 0.52 : 0.8;
      const introScaleDuration = isMobile ? 1.15 : 1.9;

      const tl = gsap.timeline();
      tl.timeScale(prefersReducedMotion ? 1 : 0.8);

      tl.to(
        introLockupRef.current,
        {
          scale: 1,
          duration: prefersReducedMotion ? 0.1 : introScaleDuration,
          ease: "power4.inOut",
        },
        0,
      )
        .to(
          logo,
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: prefersReducedMotion ? 0.1 : logoInDuration,
            ease: "expo.out",
        },
        0.18,
      )
        .to(
          logoRef.current,
          {
            y: -10,
            autoAlpha: 0,
            duration: prefersReducedMotion ? 0.1 : logoOutDuration,
            ease: "power3.inOut",
          },
          logoOutAt,
        )
        .to(
          overlayRef.current,
          {
            yPercent: -100,
            duration: prefersReducedMotion ? 0.1 : overlayOutDuration,
            ease: "expo.inOut",
          },
          overlayOutAt,
        )
        .to(
          ghostRef.current,
          {
            autoAlpha: 1,
            x: 0,
            duration: prefersReducedMotion ? 0.1 : 1.8,
            ease: "power4.out",
          },
          1.76,
        )
        .set(logoWrapRef.current, {
          display: "none",
        })
        .set(introLockupRef.current, {
          autoAlpha: 0,
        })
        .set(overlayRef.current, {
          pointerEvents: "none",
        });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const track = eyebrowTrackRef.current;
    if (!track) return;

    const ctx = gsap.context((self) => {
      const words = self.selector
        ? gsap.utils.toArray<HTMLElement>(self.selector(".eyebrow-keyword"))
        : [];
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (!words.length) return;

      gsap.set(words, {
        autoAlpha: 0,
        y: 10,
        filter: "blur(7px)",
        willChange: "transform, opacity, filter",
      });

      gsap.set(words[0], {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
      });

      if (prefersReducedMotion) {
        gsap.set(words, { willChange: "auto" });
        return;
      }

      const tl = gsap.timeline({
        delay: 2.2,
        repeat: -1,
        defaults: { ease: "power3.out" },
      });

      words.forEach((word, index) => {
        const nextWord = words[(index + 1) % words.length];

        tl.to(word, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: index === 0 ? 0.01 : 0.55,
        })
          .to(word, {
            autoAlpha: 1,
            duration: 1.8,
            ease: "none",
          })
          .to(
            word,
            {
              autoAlpha: 0,
              y: -8,
              filter: "blur(6px)",
              duration: 0.55,
              ease: "power2.inOut",
            },
          )
          .fromTo(
            nextWord,
            {
              autoAlpha: 0,
              y: 10,
              filter: "blur(7px)",
            },
            {
              autoAlpha: 0.9,
              y: 0,
              filter: "blur(0px)",
              duration: 0.62,
              ease: "power3.out",
            },
            "-=0.3",
          );
      });
    }, track);

    return () => ctx.revert();
  }, [locale]);

  return (
    <section
      ref={rootRef}
      className={`hero-cinematic-bg relative min-h-screen overflow-hidden bg-[#07101f] text-white ${heroSans.className}`}
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[url('/brand/defora-abstract-bg.svg')] bg-cover bg-[56%_46%] opacity-55 saturate-[0.68] contrast-[1.08] md:bg-center" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(105deg,rgba(3,8,18,0.9)_0%,rgba(7,16,31,0.76)_42%,rgba(6,10,18,0.9)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_16%_82%,rgba(40,205,255,0.12),transparent_26%),radial-gradient(circle_at_70%_35%,rgba(126,84,255,0.13),transparent_31%)]" />
      <div className="pointer-events-none absolute right-[-16%] top-[8%] z-[2] h-[72vh] w-[54vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(74,199,255,0.18),rgba(124,86,255,0.12)_38%,transparent_70%)] blur-3xl" />
      <div
        ref={ghostRef}
        className="pointer-events-none absolute right-[-10vw] top-1/2 z-[2] hidden h-[62vh] w-[48vw] -translate-y-1/2 lg:block"
      >
        <div className="absolute inset-y-0 left-[18%] w-px bg-gradient-to-b from-transparent via-white/[0.08] to-transparent" />
        <div className="absolute inset-y-0 left-[48%] w-px bg-gradient-to-b from-transparent via-white/[0.055] to-transparent" />
        <div className="absolute inset-x-0 top-[28%] h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        <div className="absolute inset-x-0 top-[62%] h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 rotate-[-10deg] select-none text-[clamp(12rem,19vw,20rem)] font-semibold uppercase leading-none tracking-[-0.05em] text-white/[0.04] blur-[1px]">
          DEFORA
        </div>
        <div className="absolute left-[18%] top-[28%] h-20 w-20 border border-white/[0.055]" />
        <div className="absolute right-[19%] top-[18%] h-2 w-2 rounded-full bg-white/[0.16]" />
        <div className="absolute right-[42%] bottom-[21%] h-1.5 w-1.5 rounded-full bg-cyan-200/[0.14]" />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_44%_48%,transparent_32%,rgba(3,7,16,0.82)_100%)]" />
      <div className="hero-grain pointer-events-none absolute inset-0 z-[4]" />
      <div ref={overlayRef} className="pointer-events-none absolute inset-0 z-80 bg-[#0D172B] opacity-100">
        <div
          ref={logoWrapRef}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            ref={introLockupRef}
            className="relative flex items-center justify-center"
          >
            <div
              ref={logoRef}
              className="relative z-10 flex flex-col items-center justify-center rounded-full"
            >
              <Image
                src="/brand/defora-logo.png"
                alt="Defora"
                width={1054}
                height={977}
                priority
                className="h-[min(19.65rem,34vh)] w-[min(29.48rem,82vw)] object-contain"
              />
              <span className="font-nasalization mt-10 text-[clamp(4rem,13vw,10.32rem)] leading-none">
                DEFORA
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-[70] flex min-h-[100svh] items-stretch justify-start px-5 pointer-events-auto md:min-h-[100dvh] md:px-8">
        <div
          ref={contentRef}
          className="relative z-[71] flex min-h-[100svh] w-full max-w-[min(100%,92rem)] flex-col justify-between pointer-events-auto md:min-h-[100dvh]"
        >
          <div className="flex flex-1 items-center justify-start pt-24 md:pt-28">
            <div className="flex w-fit max-w-full origin-left -translate-y-[5svh] flex-col items-center md:-translate-y-[5vh] md:scale-[1.12] lg:scale-[1.16]">
              <div
                ref={labelRef}
                className="mb-[clamp(1.1rem,2.8vh,1.9rem)] flex w-fit max-w-full min-w-0 items-center justify-center gap-3 text-white/[0.34] md:mb-[clamp(0.85rem,2.2vh,1.65rem)]"
              >
                <span
                  className="hidden h-px w-7 shrink-0 bg-white/[0.18] sm:block md:w-8"
                  aria-hidden
                />
                <p
                  ref={eyebrowTrackRef}
                  className="eyebrow-track flex flex-col items-center gap-2 overflow-visible text-center uppercase leading-snug"
                >
                  <span className="text-[0.82rem] font-medium tracking-[0.29em] text-white/72 md:text-[0.74rem] md:tracking-[0.24em] md:text-white/42">
                    {copy.focusLabel}
                  </span>
                  <span className="relative block h-[1.35em] w-[12.5rem] text-[clamp(1.25rem,3.35vw,1.5rem)] font-semibold tracking-[0.36em] text-white/80 md:w-[16rem] md:text-[clamp(1.06rem,2.9vw,1.28rem)] md:tracking-[0.34em] md:text-white/78">
                    {focusWords.map((word, index) => (
                      <span
                        key={word}
                        className={`eyebrow-keyword absolute inset-0 flex items-center justify-center ${index === 0 ? "opacity-100" : "opacity-0"}`}
                      >
                        {word}
                      </span>
                    ))}
                  </span>
                </p>
                <span
                  className="hidden h-px w-7 shrink-0 bg-white/[0.18] sm:block md:w-8"
                  aria-hidden
                />
              </div>
              <div
                ref={ctaGroupRef}
                className="flex w-fit max-w-full flex-col items-center"
              >
                <div className="flex w-fit max-w-full flex-col items-center">
                <button
                  type="button"
                  onClick={handleBookingAction}
                  className="relative z-10 rounded-full border border-white/55 bg-white/[0.13] px-7 py-[1.1rem] text-[0.86rem] font-medium uppercase leading-tight tracking-[0.2em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_20px_56px_rgba(0,0,0,0.26)] backdrop-blur-md transition-all duration-300 ease-out active:scale-[0.98] hover:border-white/65 hover:bg-white/[0.17] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_0_34px_rgba(92,190,255,0.14),0_24px_68px_rgba(0,0,0,0.34)] focus:outline-none focus:ring-2 focus:ring-white/25 focus-visible:ring-2 focus-visible:ring-white/25 md:border-white/40 md:bg-white/[0.09] md:px-8 md:py-[1.05rem] md:text-[0.84rem] md:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_20px_56px_rgba(0,0,0,0.26)] motion-reduce:transition-none"
                >
                  {copy.cta}
                </button>

                <div className="mt-[clamp(1.1rem,2.2vh,1.25rem)] flex flex-wrap items-center justify-center gap-x-3.5 gap-y-2 text-center text-[0.84rem] font-medium leading-tight tracking-[0.1em] text-white/76 md:text-[0.82rem] md:text-white/64">
                  <a
                    href={locale === "en" ? "tel:+15716006092" : phoneHref}
                    className="group inline-flex items-center gap-1 transition-all duration-200 ease-out hover:-translate-y-px hover:text-white/84 focus:outline-none focus-visible:-translate-y-px focus-visible:text-white/86 focus-visible:ring-2 focus-visible:ring-white/20 md:gap-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0"
                  >
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      className="h-[1.1rem] w-[1.1rem] shrink-0 stroke-current opacity-76 transition-opacity duration-200 ease-out group-hover:opacity-90 md:h-4 md:w-4 md:opacity-68 motion-reduce:transition-none"
                      fill="none"
                      strokeWidth="1.55"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v2.1a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 3.3 2 2 0 0 1 4.11 1h2.1a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.8a2 2 0 0 1-.45 2.11L7.53 8.5a16 16 0 0 0 6 6l.87-.89a2 2 0 0 1 2.11-.45c.9.31 1.84.53 2.8.66A2 2 0 0 1 22 16.92Z" />
                    </svg>
                    <span className="border-b border-white/0 pb-0.5 transition-colors duration-200 ease-out group-hover:border-white/30 motion-reduce:transition-none">
                      {copy.phoneCta}
                    </span>
                  </a>
                  <span
                    className="text-white/30"
                    aria-hidden
                  >
                    ·
                  </span>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1 transition-all duration-200 ease-out hover:-translate-y-px hover:text-white/84 focus:outline-none focus-visible:-translate-y-px focus-visible:text-white/86 focus-visible:ring-2 focus-visible:ring-white/20 md:gap-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0"
                  >
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      className="h-[1.1rem] w-[1.1rem] shrink-0 stroke-current opacity-76 transition-opacity duration-200 ease-out group-hover:opacity-90 md:h-4 md:w-4 md:opacity-68 motion-reduce:transition-none"
                      fill="none"
                      strokeWidth="1.55"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.6 8.6 0 0 1-7.7 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.6a8.4 8.4 0 0 1-.9-3.9 8.6 8.6 0 0 1 4.7-7.7 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.6Z" />
                    </svg>
                    <span className="border-b border-white/0 pb-0.5 transition-colors duration-200 ease-out group-hover:border-white/28 motion-reduce:transition-none">
                      {copy.whatsappCta}
                    </span>
                  </a>
                </div>
              </div>
            </div>
            </div>
          </div>
          <h1
            ref={headlineRef}
            className="flex w-full max-w-[min(100%,92rem)] flex-col gap-[clamp(0.45rem,1.4vh,1.1rem)] pb-[clamp(1.25rem,3svh,2rem)] font-semibold tracking-[-0.04em] text-white md:pb-[clamp(2.25rem,7vh,5.5rem)]"
          >
            <span className="block text-[clamp(2.8rem,9.5vw,9.2rem)] leading-[0.84] md:whitespace-nowrap">
              {copy.headline[0]}
            </span>
            <span className="block max-w-[min(100%,90rem)] text-[clamp(2rem,5.8vw,6.1rem)] leading-[0.9] md:whitespace-nowrap">
              {copy.headline[1]}
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
}
