"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
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
    headline: string[];
    cta: string;
    whatsappLabel: string;
    phoneLabel: string;
    calendarLabel: string;
    whatsappMessage: string;
    ctaRevealLabel: string;
  }
> = {
  tr: {
    label: "STRATEJİ · TASARIM · GELİŞTİRME · PERFORMANS",
    headline: ["Dijital ürünleri değil,", "çalışan sistemleri inşa ediyoruz."],
    cta: "Ücretsiz görüşme planla",
    whatsappLabel: "WhatsApp",
    phoneLabel: "Telefon",
    calendarLabel: "Takvim / Meeting",
    whatsappMessage: "Merhaba, projem hakkında görüşmek istiyorum.",
    ctaRevealLabel: "İletişim seçenekleri",
  },
  en: {
    label: "STRATEGY · DESIGN · DEVELOPMENT · PERFORMANCE",
    headline: ["We don’t build pages.", "We build systems that perform."],
    cta: "Book a consultation",
    whatsappLabel: "WhatsApp",
    phoneLabel: "Phone",
    calendarLabel: "Calendar / Meeting",
    whatsappMessage: "I’d like to discuss a project.",
    ctaRevealLabel: "Contact options",
  },
};

const phoneDisplay = "0540 033 36 72";
const phoneHref = "tel:05400333672";
const whatsappNumber = "905400333672";

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
  const ctaShellRef = useRef<HTMLDivElement | null>(null);
  const ghostRef = useRef<HTMLDivElement | null>(null);
  const [ctaOpen, setCtaOpen] = useState(false);
  const revealId = useId();
  const copy = heroCopy[locale];
  const labelParts = copy.label.split(" · ");
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    copy.whatsappMessage,
  )}`;

  const handleBookingAction = () => {
    setCtaOpen(false);
    void openBooking(locale);
  };

  useEffect(() => {
    if (!ctaOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCtaOpen(false);
    };

    const onPointerDown = (e: PointerEvent) => {
      const el = ctaShellRef.current;
      if (el && !el.contains(e.target as Node)) setCtaOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [ctaOpen]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const logo = logoRef.current;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (!logo) return;

      gsap.set(overlayRef.current, {
        yPercent: 0,
        pointerEvents: "auto",
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

      gsap.set(contentRef.current, {
        autoAlpha: 0,
      });

      gsap.set([headlineRef.current, ctaGroupRef.current], {
        autoAlpha: 0,
        y: prefersReducedMotion ? 0 : 28,
      });

      gsap.set(labelRef.current, {
        autoAlpha: 1,
      });

      gsap.set(ghostRef.current, {
        autoAlpha: 0,
        x: prefersReducedMotion ? 0 : 26,
      });

      const tl = gsap.timeline();
      tl.timeScale(0.8);

      tl.to(
        introLockupRef.current,
        {
          scale: 1,
          duration: 1.9,
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
            duration: 1.2,
            ease: "expo.out",
        },
        0.18,
      )
        .to(
          logoRef.current,
          {
            y: -10,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power3.inOut",
          },
          1.18,
        )
        .to(
          overlayRef.current,
          {
            yPercent: -100,
            duration: 1.75,
            ease: "expo.inOut",
          },
          1.08,
        )
        .to(
          contentRef.current,
          {
            autoAlpha: 1,
            duration: 0.1,
            ease: "none",
          },
          1.72,
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
        .to(
          [headlineRef.current, ctaGroupRef.current],
          {
            autoAlpha: 1,
            y: 0,
            duration: prefersReducedMotion ? 0.1 : 1.25,
            stagger: prefersReducedMotion ? 0 : 0.12,
            ease: "power4.out",
          },
          1.82,
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
      const words = self.selector?.(".eyebrow-word") ?? [];
      const separators = self.selector?.(".eyebrow-separator") ?? [];
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      console.log(
        "[Hero eyebrow animation]",
        "words:",
        words.length,
        "separators:",
        separators.length,
        "reducedMotion:",
        prefersReducedMotion,
      );

      if (!words.length) return;

      gsap.set(track, {
        x: 0,
        willChange: "transform",
      });

      gsap.set(words, {
        autoAlpha: 0,
        y: 24,
        filter: "blur(12px)",
        willChange: "transform, opacity, filter",
      });

      gsap.set(separators, {
        autoAlpha: 0,
        y: 10,
        filter: "blur(8px)",
        willChange: "transform, opacity, filter",
      });

      const tl = gsap.timeline({ delay: 1.9 });

      tl.to(words, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      })
        .to(
          separators,
          {
            autoAlpha: 0.9,
            y: 0,
            filter: "blur(0px)",
            duration: 0.65,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.38",
        )
        .set([words, separators], {
          willChange: "auto",
        });

      if (!prefersReducedMotion) {
        tl.to(
          track,
          {
            x: 22,
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          },
          "+=0.25",
        );
      }
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
      <div ref={overlayRef} className="absolute inset-0 z-30 bg-[#0D172B]">
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

      <div className="relative z-[70] flex min-h-[100dvh] min-h-screen items-stretch justify-start px-5 pointer-events-auto md:px-8">
        <div
          ref={contentRef}
          className="relative z-[71] flex min-h-[100dvh] w-full max-w-[min(100%,92rem)] flex-col pointer-events-auto"
        >
          <div className="w-full max-w-[min(100%,72rem)] pt-[calc(6rem+10vh)] md:pt-[calc(7rem+10vh)]">
            <div
              ref={labelRef}
              className="mb-[clamp(0.85rem,2.2vh,1.65rem)] flex w-full min-w-0 items-center justify-center gap-3 text-white/[0.34]"
            >
              <span
                className="h-px w-7 shrink-0 bg-white/[0.18] md:w-8"
                aria-hidden
              />
              <p
                ref={eyebrowTrackRef}
                className="eyebrow-track shrink-0 overflow-visible text-[0.884rem] font-medium uppercase leading-snug tracking-[0.32em] md:text-[0.91rem] md:tracking-[0.34em]"
              >
                {labelParts.map((part, index) => (
                  <span key={part}>
                    <span className="eyebrow-word inline-block">
                      {part}
                    </span>
                    {index < labelParts.length - 1 ? (
                      <span
                        className="eyebrow-separator inline-block px-[0.45em]"
                        aria-hidden
                      >
                        ·
                      </span>
                    ) : null}
                  </span>
                ))}
              </p>
              <span
                className="h-px w-7 shrink-0 bg-white/[0.18] md:w-8"
                aria-hidden
              />
            </div>
            <div
              ref={ctaGroupRef}
              className="mx-auto flex w-full max-w-[min(100%,36rem)] flex-col items-center"
            >
              <div ref={ctaShellRef} className="flex w-full max-w-md flex-col items-center">
                <button
                  type="button"
                  onClick={() => setCtaOpen((open) => !open)}
                  aria-expanded={ctaOpen}
                  aria-controls={revealId}
                  className="relative z-10 rounded-full border border-white/40 bg-white/[0.09] px-6 py-3.5 text-[0.7rem] font-medium uppercase leading-tight tracking-[0.2em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_20px_56px_rgba(0,0,0,0.26)] backdrop-blur-md transition-all duration-300 ease-out hover:border-white/65 hover:bg-white/[0.17] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_0_34px_rgba(92,190,255,0.14),0_24px_68px_rgba(0,0,0,0.34)] focus:outline-none focus:ring-2 focus:ring-white/25 focus-visible:ring-2 focus-visible:ring-white/25 md:px-7 motion-reduce:transition-none"
                >
                  {copy.cta}
                </button>

                <div
                  id={revealId}
                  role="region"
                  aria-label={copy.ctaRevealLabel}
                  aria-hidden={!ctaOpen}
                  className={`grid w-full transition-[grid-template-rows] duration-[250ms] ease-out motion-reduce:duration-75 ${ctaOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div
                      inert={!ctaOpen}
                      className={`origin-top pt-4 transition-[opacity,transform] duration-[250ms] ease-out motion-reduce:duration-75 ${ctaOpen ? "translate-y-0 opacity-100 motion-reduce:transition-none" : "pointer-events-none -translate-y-2 opacity-0 motion-reduce:translate-y-0 motion-reduce:transition-none"}`}
                    >
                      <div className="rounded-2xl border border-white/[0.14] bg-white/[0.055] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md">
                        <ul className="divide-y divide-white/[0.08]">
                          <li>
                            <a
                              href={whatsappHref}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => setCtaOpen(false)}
                              className="flex w-full items-center justify-between gap-4 rounded-xl px-3.5 py-3 text-left text-[0.8125rem] font-medium tracking-[0.02em] text-white/88 transition-colors duration-200 ease-out hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 motion-reduce:transition-none"
                            >
                              <span>{copy.whatsappLabel}</span>
                              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/38">
                                →
                              </span>
                            </a>
                          </li>
                          <li>
                            <a
                              href={phoneHref}
                              onClick={() => setCtaOpen(false)}
                              className="flex w-full flex-col items-start gap-0.5 rounded-xl px-3.5 py-3 text-left transition-colors duration-200 ease-out hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 motion-reduce:transition-none"
                            >
                              <span className="text-[0.8125rem] font-medium tracking-[0.02em] text-white/88">
                                {copy.phoneLabel}
                              </span>
                              <span className="text-[0.7rem] font-medium tracking-[0.04em] text-white/45">
                                {phoneDisplay}
                              </span>
                            </a>
                          </li>
                          <li>
                            <button
                              type="button"
                              onClick={handleBookingAction}
                              className="flex w-full items-center justify-between gap-4 rounded-xl px-3.5 py-3 text-left text-[0.8125rem] font-medium tracking-[0.02em] text-white/88 transition-colors duration-200 ease-out hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 motion-reduce:transition-none"
                            >
                              <span>{copy.calendarLabel}</span>
                              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/38">
                                →
                              </span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="min-h-[clamp(4rem,17vh,12rem)] flex-1" aria-hidden />
          <h1
            ref={headlineRef}
            className="flex w-full max-w-[min(100%,92rem)] flex-col gap-[clamp(0.45rem,1.4vh,1.1rem)] pb-[clamp(2.25rem,7vh,5.5rem)] font-semibold tracking-[-0.04em] text-white"
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
