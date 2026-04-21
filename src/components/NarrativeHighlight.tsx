"use client";

import { useLayoutEffect, useRef } from "react";
import { Inter } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const narrativeFont = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

const lines = [
  {
    text: "Web siteleri çoğu zaman sadece görünür.",
    emphasis: "görünür",
  },
  {
    text: "Ama büyüme, görünmekle değil, çalışmakla olur.",
    emphasis: ["büyüme", "çalışmakla"],
  },
  {
    text: "Biz dijital yapıları bir sistem olarak kurarız.",
    emphasis: "bir sistem",
  },
  {
    text: "Sonuç: Trafik, veri ve dönüşüm aynı akışta ilerler.",
    emphasis: "Trafik, veri ve dönüşüm",
  },
] as const;

function renderLine(
  text: string,
  emphasis: string | readonly string[],
  key: string,
) {
  const terms = Array.isArray(emphasis) ? [...emphasis] : [emphasis];
  const sortedTerms = [...terms].sort((a, b) => b.length - a.length);
  const parts: Array<{ text: string; emphasized: boolean }> = [];
  let cursor = 0;

  while (cursor < text.length) {
    const remaining = text.slice(cursor);
    const match = sortedTerms.find((term) => remaining.startsWith(term));

    if (match) {
      parts.push({ text: match, emphasized: true });
      cursor += match.length;
      continue;
    }

    let nextIndex = text.length;
    for (const term of sortedTerms) {
      const index = text.indexOf(term, cursor);
      if (index !== -1 && index < nextIndex) nextIndex = index;
    }

    parts.push({
      text: text.slice(cursor, nextIndex),
      emphasized: false,
    });
    cursor = nextIndex;
  }

  return parts.map((part, index) =>
    part.emphasized ? (
      <span
        key={`${key}-phrase-${index}`}
        data-narrative-phrase="true"
        className="narrative-phrase text-white/36"
      >
        {part.text}
      </span>
    ) : (
      <span key={`${key}-text-${index}`}>{part.text}</span>
    ),
  );
}

export default function NarrativeHighlight() {
  const rootRef = useRef<HTMLElement | null>(null);
  const lineRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const finalGlowRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const section = rootRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const lineNodes = lineRefs.current.filter(
        (line): line is HTMLParagraphElement => line !== null,
      );
      const phraseNodes = gsap.utils.toArray<HTMLSpanElement>("[data-narrative-phrase='true']");

      if (prefersReducedMotion) {
        gsap.set(lineNodes, {
          color: "rgba(255,255,255,0.74)",
          clearProps: "transform,filter",
        });
        gsap.set(phraseNodes, {
          color: "rgba(255,255,255,0.92)",
          fontWeight: 500,
          textShadow: "none",
        });
        gsap.set(finalGlowRef.current, {
          opacity: 0.06,
        });
        return;
      }

      gsap.set(lineNodes, {
        color: "rgba(255,255,255,0.46)",
        y: 5,
        filter: "blur(0.8px)",
      });
      gsap.set(phraseNodes, {
        color: "rgba(255,255,255,0.56)",
        fontWeight: 500,
        textShadow: "none",
      });
      gsap.set(finalGlowRef.current, {
        opacity: 0,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 84%",
          end: "bottom 18%",
          scrub: 0.95,
        },
      });

      lineNodes.forEach((line, index) => {
        const linePhrases = gsap.utils.toArray<HTMLSpanElement>(
          line.querySelectorAll("[data-narrative-phrase='true']"),
        );
        const isFinal = index === lineNodes.length - 1;
        const position = index * 1;

        timeline.to(
          line,
          {
            color: isFinal ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.8)",
            y: 0,
            filter: "blur(0px)",
            duration: 0.78,
            ease: "none",
          },
          position,
        );

        if (linePhrases.length) {
          timeline.to(
            linePhrases,
            {
              color: isFinal ? "rgba(248,249,255,0.98)" : "rgba(242,244,255,0.94)",
              fontWeight: isFinal ? 600 : 500,
              textShadow: "none",
              duration: 0.62,
              ease: "none",
            },
            position + 0.2,
          );
        }
      });

      timeline.to(
        finalGlowRef.current,
        {
          opacity: 0.08,
          duration: 0.72,
          ease: "none",
        },
        3.2,
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className={`relative overflow-hidden bg-[#050b14] px-5 py-14 text-white md:px-8 md:py-18 ${narrativeFont.className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.015),transparent_26%,transparent)]" />

      <div className="relative mx-auto max-w-[92rem]">
        <div className="max-w-[62rem] lg:max-w-[68rem]">
          <div className="space-y-4 md:space-y-5">
            {lines.map((line, index) => (
              <p
                key={line.text}
                ref={(node) => {
                  lineRefs.current[index] = node;
                }}
                className={`relative max-w-[26ch] text-[clamp(1.65rem,3.4vw,3.8rem)] font-normal leading-[1.14] tracking-[-0.04em] text-white/40 md:max-w-[29ch] ${
                  index === lines.length - 1 ? "max-w-[30ch] md:max-w-[34ch]" : ""
                }`}
              >
                {index === lines.length - 1 ? (
                  <span className="relative inline-block">
                    <span
                      ref={finalGlowRef}
                      className="pointer-events-none absolute inset-x-0 bottom-[12%] top-[18%] -z-10 rounded-[18px] bg-[radial-gradient(circle_at_left_center,rgba(255,255,255,0.06),transparent_74%)] opacity-0 blur-lg"
                    />
                    {renderLine(line.text, line.emphasis, `line-${index}`)}
                  </span>
                ) : (
                  renderLine(line.text, line.emphasis, `line-${index}`)
                )}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
