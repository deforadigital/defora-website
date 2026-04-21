"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/i18n";

const sectionCopy: Record<
  Locale,
  {
    label: string;
    heading: string;
    intro: string;
    outputLabel: string;
    offerTitle: string;
    offerDescription: string;
    offerNote: string;
    phases: Array<{
      title: string;
      description: string;
      items: string[];
    }>;
  }
> = {
  tr: {
    label: "Büyüme Sistemi",
    heading: "Web, trafik ve optimizasyonu tek çalışan sistemde birleştiriyoruz.",
    intro: "Her parça bir sonraki adımı besler; sonuç tek akışta büyür.",
    outputLabel: "Tüm sistemin çıktısı",
    offerTitle: "Büyüme Paketi",
    offerDescription:
      "Web sitesi, reklam trafiği ve veri odaklı iyileştirme aynı ritimde çalışır; marka daha net ölçer, daha hızlı öğrenir, daha bilinçli büyür.",
    offerNote: "Detayları birlikte netleştirelim.",
    phases: [
      {
        title: "Altyapı",
        description: "Performans odaklı web siteleri ve dijital altyapılar kurarız.",
        items: ["Web Tasarım & Geliştirme", "Landing Page", "Teknik Altyapı"],
      },
      {
        title: "Trafik",
        description: "Doğru kitleyi doğru sisteme yönlendiririz.",
        items: ["Google Ads", "Meta Ads", "Yeniden Hedefleme"],
      },
      {
        title: "Optimizasyon",
        description: "Veriyi analiz eder, dönüşümü sürekli iyileştiririz.",
        items: ["CRO", "Analytics", "Funnel İyileştirme"],
      },
    ],
  },
  en: {
    label: "Growth System",
    heading: "We connect web, traffic, and optimization into one working system.",
    intro: "Each part feeds the next, so growth becomes easier to measure and improve.",
    outputLabel: "Output of the full system",
    offerTitle: "Growth Package",
    offerDescription:
      "Website, paid traffic, and data-led optimization work in one rhythm, helping your brand measure clearly, learn faster, and grow with intent.",
    offerNote: "We can shape the details together.",
    phases: [
      {
        title: "Infrastructure",
        description: "We build performance-led websites and digital foundations.",
        items: ["Web Design & Development", "Landing Page", "Technical Setup"],
      },
      {
        title: "Traffic",
        description: "We route the right audience into the right system.",
        items: ["Google Ads", "Meta Ads", "Retargeting"],
      },
      {
        title: "Optimization",
        description: "We analyze data and continuously improve conversion.",
        items: ["CRO", "Analytics", "Funnel Improvement"],
      },
    ],
  },
};

export default function GrowthSystem({ locale }: { locale: Locale }) {
  const copy = sectionCopy[locale];
  const rootRef = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const connectorRef = useRef<HTMLDivElement | null>(null);
  const connectorSweepRef = useRef<HTMLDivElement | null>(null);
  const offerRef = useRef<HTMLDivElement | null>(null);
  const blockRefs = useRef<Array<HTMLElement | null>>([]);
  const connectorSegmentRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    const section = rootRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const cleanupFns: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const blocks = blockRefs.current.filter(
        (block): block is HTMLElement => block !== null,
      );
      const introSteps = gsap.utils.toArray<HTMLElement>(".growth-intro-step");
      const introText =
        introRef.current?.querySelector<HTMLElement>(".growth-intro-copy") ?? null;
      const targets = [
        ...introSteps,
        introText,
        ...blocks,
        connectorRef.current,
        offerRef.current,
      ].filter(Boolean);

      if (prefersReducedMotion) {
        gsap.set(targets, {
          autoAlpha: 1,
          clearProps: "transform,filter",
        });
        return;
      }

      gsap.set(introSteps, {
        autoAlpha: 0,
        y: 18,
        filter: "blur(6px)",
      });
      if (introText) {
        gsap.set(introText, {
          autoAlpha: 0,
          y: 12,
          filter: "blur(4px)",
        });
      }
      gsap.set(blocks, {
        autoAlpha: 0,
        y: 20,
        filter: "blur(6px)",
      });
      gsap.set(offerRef.current, {
        autoAlpha: 0,
        y: 18,
        filter: "blur(6px)",
      });
      gsap.set(connectorSweepRef.current, {
        autoAlpha: 0,
        xPercent: -120,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          once: true,
        },
      });

      timeline
        .to(introSteps, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.66,
          ease: "power3.out",
          stagger: 0.05,
        })
        .to(
          introText ? [introText] : [],
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.52,
            ease: "power3.out",
          },
          "-=0.3",
        )
        .to(
          blocks,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.56,
            ease: "power3.out",
            stagger: 0.1,
          },
          "-=0.1",
        )
        .to(
          connectorSweepRef.current,
          {
            autoAlpha: 1,
            xPercent: 120,
            duration: 0.72,
            ease: "power3.inOut",
          },
          "-=0.02",
        )
        .to(
          connectorSweepRef.current,
          {
            autoAlpha: 0,
            duration: 0.16,
            ease: "power2.out",
          },
          "-=0.08",
        )
        .to(
          offerRef.current,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.56,
            ease: "power3.out",
          },
          "-=0.02",
        );

      blocks.forEach((block, index) => {
        const currentSegment = connectorSegmentRefs.current[index];
        const nextSegment = connectorSegmentRefs.current[index + 1];

        const handleEnter = () => {
          gsap.to(block, {
            y: -3,
            borderColor: "rgba(255,255,255,0.2)",
            backgroundColor: index === 2 ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.055)",
            duration: 0.2,
            ease: "power2.out",
            overwrite: "auto",
          });

          if (currentSegment) {
            gsap.to(currentSegment, {
              opacity: 0.95,
              scaleX: 1,
              duration: 0.2,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          if (nextSegment) {
            gsap.to(nextSegment, {
              opacity: 0.48,
              duration: 0.2,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        };

        const handleLeave = () => {
          gsap.to(block, {
            y: 0,
            borderColor: index === 2 ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.1)",
            backgroundColor:
              index === 0
                ? "rgba(255,255,255,0.028)"
                : index === 1
                  ? "rgba(255,255,255,0.036)"
                  : "rgba(255,255,255,0.048)",
            duration: 0.22,
            ease: "power2.out",
            overwrite: "auto",
          });

          if (currentSegment) {
            gsap.to(currentSegment, {
              opacity: index === 2 ? 0.36 : index === 1 ? 0.28 : 0.22,
              scaleX: 1,
              duration: 0.2,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          if (nextSegment) {
            gsap.to(nextSegment, {
              opacity: index + 1 === 2 ? 0.36 : index + 1 === 1 ? 0.28 : 0.22,
              duration: 0.2,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        };

        block.addEventListener("pointerenter", handleEnter);
        block.addEventListener("pointerleave", handleLeave);

        cleanupFns.push(() => {
          block.removeEventListener("pointerenter", handleEnter);
          block.removeEventListener("pointerleave", handleLeave);
        });
      });
    }, rootRef);

    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="services"
      ref={rootRef}
      className="relative overflow-hidden bg-[#050b14] px-5 py-18 text-white md:px-8 md:py-22"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.032)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.024)_1px,transparent_1px)] bg-[size:18rem_18rem] opacity-20" />

      <div className="relative mx-auto max-w-[92rem]">
        <div ref={introRef} className="max-w-4xl">
          <p className="growth-intro-step text-xs font-medium uppercase tracking-[0.46em] text-white/45 md:text-sm">
            {copy.label}
          </p>
          <h2 className="growth-intro-step mt-6 max-w-4xl text-[clamp(2.35rem,5.4vw,6.2rem)] font-medium leading-[0.98] tracking-[-0.045em] text-white">
            {copy.heading}
          </h2>
          <p className="growth-intro-copy mt-6 max-w-xl text-base leading-[1.8] text-white/58 md:text-lg">
            {copy.intro}
          </p>
        </div>

        <div className="relative mt-12 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-0">
          <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.028),rgba(255,255,255,0.012))] md:block" />
          <div className="pointer-events-none absolute inset-0 hidden border border-white/5 md:block" />
          <div className="pointer-events-none absolute left-[8%] right-[8%] top-[39%] hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:block" />
          <div
            ref={connectorRef}
            className="pointer-events-none absolute left-[8%] right-[8%] top-[39%] hidden md:grid md:grid-cols-3 md:gap-0"
          />
          <div
            ref={connectorSweepRef}
            className="pointer-events-none absolute left-[8%] right-[8%] top-[calc(39%-1px)] hidden h-[3px] bg-gradient-to-r from-transparent via-white/55 to-transparent blur-[1px] md:block"
          />

          {[0, 1, 2].map((segment) => (
            <div
              key={`segment-${segment}`}
              ref={(node) => {
                connectorSegmentRefs.current[segment] = node;
              }}
              className={`pointer-events-none absolute top-[39%] hidden h-px md:block ${
                segment === 0
                  ? "left-[8%] w-[28%] bg-gradient-to-r from-transparent via-white/18 to-white/12"
                  : segment === 1
                    ? "left-[36%] w-[28%] bg-gradient-to-r from-white/14 via-white/24 to-white/16"
                    : "left-[64%] w-[28%] bg-gradient-to-r from-white/18 via-white/32 to-transparent"
              }`}
              style={{
                opacity: segment === 0 ? 0.22 : segment === 1 ? 0.28 : 0.36,
              }}
            />
          ))}

          {copy.phases.map((phase, index) => (
            <article
              key={phase.title}
              ref={(node) => {
                blockRefs.current[index] = node;
              }}
              className={`group relative z-10 flex min-h-[24rem] flex-col justify-between overflow-hidden border p-6 backdrop-blur-sm transition duration-300 ease-out md:min-h-[28rem] md:p-8 ${
                index === 0
                  ? "border-white/10 bg-white/[0.028]"
                  : index === 1
                    ? "border-white/11 bg-white/[0.036]"
                    : "border-white/13 bg-white/[0.048]"
              }`}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-white/26 to-transparent transition duration-500 ease-out group-hover:scale-x-100" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_32%,transparent)] opacity-60" />
              <div>
                <div className="mb-10 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-[0.36em] text-white/35">
                    0{index + 1}
                  </span>
                  <span className="h-2 w-2 border border-white/28 bg-[#050b14] transition duration-300 group-hover:border-white/50" />
                </div>

                <h3 className="text-[clamp(2rem,3.2vw,4.2rem)] font-medium leading-none tracking-[-0.05em] text-white">
                  {phase.title}
                </h3>
                <p className="mt-6 max-w-[18rem] text-sm leading-[1.75] text-white/58 md:max-w-[19rem] md:text-base">
                  {phase.description}
                </p>
              </div>

              <ul className="mt-12 space-y-3 text-sm text-white/72 md:text-[0.95rem]">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="h-px w-7 bg-white/22" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div
          ref={offerRef}
          className="relative mt-4 overflow-hidden border border-white/12 bg-white/[0.058] p-6 backdrop-blur-md md:mt-5 md:p-8 lg:p-9"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-[radial-gradient(circle_at_left_center,rgba(255,255,255,0.075),transparent_68%)]" />
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.34em] text-white/34 md:text-xs">
              {copy.outputLabel}
            </p>
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.42em] text-white/40">
              {copy.offerTitle}
            </p>
            <p className="mt-4 max-w-3xl text-xl font-medium leading-[1.28] tracking-[-0.025em] text-white/84 md:text-3xl">
              {copy.offerDescription}
            </p>
            <p className="mt-4 text-sm leading-[1.6] text-white/46 md:text-[0.95rem]">
              {copy.offerNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
