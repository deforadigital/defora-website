"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/i18n";

const aboutCopy: Record<
  Locale,
  {
    openingHeading: string;
    openingText: string;
    philosophy: string[];
    workLabel: string;
    workSteps: Array<{ title: string; text: string }>;
    trustHeading: string;
    trustList: string[];
    closingText: string;
  }
> = {
  tr: {
    openingHeading: "Defora bir ajans değil, bir sistem yaklaşımıdır.",
    openingText: "Projeler teslim etmek yerine, sürekli çalışan dijital yapılar kuruyoruz.",
    philosophy: [
      "Sürdürülebilir sistemler",
      "Performans odaklı yaklaşım",
      "Veri ile gelişen yapılar",
    ],
    workLabel: "Nasıl çalışıyoruz",
    workSteps: [
      { title: "Kur", text: "Performans odaklı altyapıyı kurarız" },
      { title: "Yönlendir", text: "Doğru trafiği sisteme yönlendiririz" },
      { title: "Optimize Et", text: "Veriyle sistemi sürekli geliştiririz" },
    ],
    trustHeading:
      "Çoğu ekip yayına alır ve süreci burada bırakır.\nBiz test eder, ölçer ve sürekli iyileştiririz.",
    trustList: [
      "Lansman öncesi detaylı test süreçleri",
      "Performans ve hız odaklı geliştirme",
      "Veri temelli karar alma",
    ],
    closingText:
      "Sadece bir web sitesi değil, çalışan bir sistem arıyorsanız doğru yerdesiniz.",
  },
  en: {
    openingHeading: "Defora is not an agency model. It is a systems approach.",
    openingText: "We do not just finish projects. We build digital structures that keep working.",
    philosophy: [
      "Sustainable systems",
      "Performance-first thinking",
      "Structures that improve through data",
    ],
    workLabel: "How we work",
    workSteps: [
      { title: "Build", text: "We establish the foundation" },
      { title: "Direct", text: "We bring in the right traffic" },
      { title: "Optimize", text: "We improve continuously through data" },
    ],
    trustHeading:
      "Most teams launch and leave.\nWe test, measure, and keep improving.",
    trustList: [
      "Detailed QA before launch",
      "Performance and speed-led development",
      "Decisions shaped by data",
    ],
    closingText:
      "If you need more than a website, and want a system that works, you are in the right place.",
  },
};

export default function AboutSystem({ locale }: { locale: Locale }) {
  const copy = aboutCopy[locale];
  const rootRef = useRef<HTMLElement | null>(null);
  const openingRef = useRef<HTMLDivElement | null>(null);
  const middleRef = useRef<HTMLDivElement | null>(null);
  const workConnectorRef = useRef<HTMLDivElement | null>(null);
  const trustRef = useRef<HTMLDivElement | null>(null);
  const workStepRefs = useRef<Array<HTMLElement | null>>([]);

  useLayoutEffect(() => {
    const section = rootRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const philosophyItems = gsap.utils.toArray<HTMLElement>(".about-philosophy-item");
      const workSteps = workStepRefs.current.filter(
        (step): step is HTMLElement => step !== null,
      );

      if (prefersReducedMotion) {
        gsap.set(
          [
            openingRef.current,
            middleRef.current,
            ...philosophyItems,
            ...workSteps,
            workConnectorRef.current,
            trustRef.current,
          ].filter(Boolean),
          {
            autoAlpha: 1,
            clearProps: "transform,filter",
          },
        );
        return;
      }

      gsap.set(openingRef.current, {
        autoAlpha: 0,
        y: 16,
        filter: "blur(4px)",
      });
      gsap.set(philosophyItems, {
        autoAlpha: 0,
        y: 12,
        filter: "blur(4px)",
      });
      gsap.set(middleRef.current, {
        autoAlpha: 0,
        y: 14,
        filter: "blur(4px)",
      });
      gsap.set(workSteps, {
        autoAlpha: 0,
        y: 14,
        filter: "blur(4px)",
      });
      gsap.set(workConnectorRef.current, {
        autoAlpha: 0,
        scaleX: 0,
        transformOrigin: "0% 50%",
      });
      gsap.set(trustRef.current, {
        autoAlpha: 0,
        y: 14,
        filter: "blur(4px)",
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            once: true,
          },
        })
        .to(openingRef.current, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
            duration: 0.64,
            ease: "power3.out",
          })
        .to(
          philosophyItems,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.56,
            ease: "power3.out",
            stagger: 0.08,
          },
          "-=0.24",
        )
        .to(
          middleRef.current,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.54,
            ease: "power3.out",
          },
          "-=0.26",
        )
        .to(
          workSteps,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.08,
          },
          "-=0.18",
        )
        .to(
          workConnectorRef.current,
          {
            autoAlpha: 1,
            scaleX: 1,
            duration: 0.58,
            ease: "power3.inOut",
          },
          "-=0.08",
        )
        .to(
          trustRef.current,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.56,
            ease: "power3.out",
          },
          "-=0.04",
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={rootRef}
      className="relative overflow-hidden bg-[#040913] px-5 py-16 text-white md:px-8 md:py-20"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/8" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.026)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:20rem_20rem] opacity-20" />

      <div className="relative mx-auto max-w-[92rem]">
        <div className="max-w-[74rem]">
          <div ref={openingRef} className="max-w-[48rem]">
            <h2 className="text-[clamp(2rem,4.2vw,4.7rem)] font-medium leading-[1] tracking-[-0.045em] text-white">
              {copy.openingHeading}
            </h2>
            <p className="mt-4 max-w-[34rem] text-base leading-[1.68] text-white/60 md:text-lg">
              {copy.openingText}
            </p>
          </div>

          <div
            ref={middleRef}
            className="mt-10 grid gap-7 border-t border-white/8 pt-7 md:mt-10 md:grid-cols-[0.9fr_1.1fr] md:gap-8 md:pt-7"
          >
            <div className="space-y-1.5 self-start md:space-y-2">
              {copy.philosophy.map((item) => (
                <div
                  key={item}
                  className="about-philosophy-item flex items-center gap-4 border-b border-white/7 py-3 last:border-b-0 md:py-3.5"
                >
                  <span className="h-px w-8 shrink-0 bg-white/20" />
                  <p className="text-base leading-[1.55] text-white/76 md:text-lg">{item}</p>
                </div>
              ))}
            </div>

            <div className="self-start">
              <p className="text-xs font-medium uppercase tracking-[0.42em] text-white/40">
                {copy.workLabel}
              </p>

              <div className="relative mt-4 space-y-3 md:mt-5">
                <div
                  ref={workConnectorRef}
                  className="pointer-events-none absolute bottom-5 left-4 top-5 w-px bg-gradient-to-b from-white/10 via-white/22 to-white/10 md:bottom-auto md:left-[8%] md:right-[8%] md:top-8 md:h-px md:w-auto md:bg-gradient-to-r md:from-transparent md:via-white/22 md:to-transparent"
                />

                {copy.workSteps.map((step, index) => (
                  <article
                    key={step.title}
                    ref={(node) => {
                      workStepRefs.current[index] = node;
                    }}
                    className="relative grid gap-3 border border-white/7 bg-white/[0.018] px-5 py-4 backdrop-blur-sm md:grid-cols-[auto_1fr] md:items-center md:gap-5 md:px-6 md:py-4.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[0.68rem] font-medium uppercase tracking-[0.34em] text-white/30">
                        0{index + 1}
                      </span>
                      <h3 className="text-[clamp(1.25rem,2vw,2rem)] font-medium leading-none tracking-[-0.04em] text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="max-w-[18rem] text-sm leading-[1.65] text-white/60 md:max-w-none md:text-[0.96rem]">
                      {step.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div
            ref={trustRef}
            className="mt-8 border-t border-white/8 pt-7 md:mt-8 md:pt-7"
          >
            <h3 className="max-w-3xl whitespace-pre-line text-[clamp(1.8rem,3.2vw,3.4rem)] font-medium leading-[1.06] tracking-[-0.04em] text-white">
              {copy.trustHeading}
            </h3>

            <ul className="mt-4 grid gap-3 md:mt-5 md:grid-cols-3 md:gap-4">
              {copy.trustList.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-[1.68] text-white/72 md:text-base"
                >
                  <span className="mt-3 h-px w-7 bg-white/24" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 max-w-2xl text-[clamp(1.5rem,2.6vw,2.35rem)] font-medium leading-[1.16] tracking-[-0.03em] text-white md:mt-7">
              {copy.closingText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
