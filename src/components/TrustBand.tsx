"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const primaryLine =
  "Gerçek projeler · Ölçülebilir yapılar · Web + strateji + geliştirme · İşletmeye özel sistemler";
const secondaryLine =
  "Sistem odaklı yaklaşım · Net yapı · Dönüşüm mantığı · Çalışan dijital akışlar";

const primaryItems = Array.from({ length: 4 }, () => `${primaryLine} ·`);
const secondaryItems = Array.from({ length: 4 }, () => `${secondaryLine} ·`);

export default function TrustBand() {
  const rootRef = useRef<HTMLElement | null>(null);
  const primaryTrackRef = useRef<HTMLDivElement | null>(null);
  const secondaryTrackRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const primaryTrack = primaryTrackRef.current;
    const secondaryTrack = secondaryTrackRef.current;
    if (!primaryTrack || !secondaryTrack) return;

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        gsap.set([primaryTrack, secondaryTrack], {
          clearProps: "transform",
        });
        return;
      }

      const primaryTween = gsap.to(primaryTrack, {
        xPercent: -50,
        duration: 56,
        ease: "none",
        repeat: -1,
      });

      const secondaryTween = gsap.to(secondaryTrack, {
        xPercent: 50,
        duration: 68,
        ease: "none",
        repeat: -1,
      });

      const root = rootRef.current;
      if (!root) return;

      const slowTo = (timeScale: number) => {
        gsap.to([primaryTween, secondaryTween], {
          timeScale,
          duration: 0.35,
          ease: "power2.out",
          overwrite: true,
        });
      };

      const handleEnter = () => slowTo(0.72);
      const handleLeave = () => slowTo(1);

      root.addEventListener("mouseenter", handleEnter);
      root.addEventListener("mouseleave", handleLeave);

      return () => {
        root.removeEventListener("mouseenter", handleEnter);
        root.removeEventListener("mouseleave", handleLeave);
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-label="Trust band"
      className="relative overflow-hidden bg-[#050b14] py-3"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/8" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/6" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-16 bg-gradient-to-r from-[#050b14] to-transparent md:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-16 bg-gradient-to-l from-[#050b14] to-transparent md:w-24" />

      <div className="relative space-y-1.5 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="overflow-hidden">
          <div
            ref={primaryTrackRef}
            className="flex w-max min-w-[200%] will-change-transform"
          >
            {[...primaryItems, ...primaryItems].map((item, index) => (
              <span
                key={`primary-${index}`}
                className="shrink-0 whitespace-nowrap px-4 text-[clamp(14px,1.1vw,16px)] font-medium uppercase tracking-[0.08em] text-[rgba(255,255,255,0.75)] md:px-6"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            ref={secondaryTrackRef}
            className="flex w-max min-w-[200%] -translate-x-1/2 will-change-transform"
          >
            {[...secondaryItems, ...secondaryItems].map((item, index) => (
              <span
                key={`secondary-${index}`}
                className="shrink-0 whitespace-nowrap px-4 text-[clamp(12px,0.9vw,14px)] font-medium uppercase tracking-[0.08em] text-[rgba(255,255,255,0.45)] md:px-6"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
