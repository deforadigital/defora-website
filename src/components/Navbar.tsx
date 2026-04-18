"use client";

import {
  type MouseEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import LanguageSwitch from "@/components/LanguageSwitch";
import { type Locale, localizePathname } from "@/lib/i18n";

const menuLinks: Record<Locale, Array<{ label: string; target: string }>> = {
  tr: [
    { label: "Projeler", target: "work" },
    { label: "Hizmetler", target: "services" },
    { label: "Studio", target: "about" },
    { label: "İletişim", target: "contact" },
  ],
  en: [
    { label: "Work", target: "work" },
    { label: "Services", target: "services" },
    { label: "Studio", target: "about" },
    { label: "Contact", target: "contact" },
  ],
};
const panelEase = "expo.inOut";
const linkEase = "power3.out";

export default function Navbar({ locale }: { locale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const homePath = localizePathname("/", locale);

  const handleHomeClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setIsOpen(false);
    document.body.style.overflow = "";

    if (
      window.location.pathname === homePath &&
      window.location.hash === "" &&
      window.location.search === ""
    ) {
      window.location.reload();
      return;
    }

    window.location.assign(homePath);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const links = linkRefs.current.filter(Boolean);

    if (!overlay || !panel) return;

    gsap.killTweensOf([overlay, panel, ...links]);

    if (isOpen) {
      gsap.set(overlay, {
        pointerEvents: "auto",
      });

      gsap
        .timeline()
        .fromTo(
          overlay,
          {
            autoAlpha: 0,
          },
          {
            autoAlpha: 1,
            duration: 0.68,
            ease: "power2.out",
          },
        )
        .fromTo(
          panel,
          {
            clipPath: "ellipse(0% 135% at 100% 50%)",
            autoAlpha: 1,
            xPercent: 8,
          },
          {
            clipPath: "ellipse(170% 135% at 100% 50%)",
            autoAlpha: 1,
            xPercent: 0,
            duration: 1.25,
            ease: panelEase,
          },
          0,
        )
        .fromTo(
          links,
          {
            autoAlpha: 0,
            y: 18,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.76,
            stagger: 0.085,
            ease: linkEase,
          },
          0.64,
        );

      return;
    }

    gsap
      .timeline({
        onComplete: () => {
          gsap.set(overlay, {
            pointerEvents: "none",
          });
        },
      })
      .to(links, {
        autoAlpha: 0,
        y: -10,
        duration: 0.34,
        stagger: 0.035,
        ease: "power3.in",
      })
      .to(
        panel,
        {
          clipPath: "ellipse(0% 135% at 100% 50%)",
          xPercent: 8,
          duration: 0.9,
          ease: panelEase,
        },
        0,
      )
      .to(
        overlay,
        {
          autoAlpha: 0,
          duration: 0.7,
          ease: "power2.inOut",
        },
        0.18,
      );
  }, [isOpen]);

  return (
    <>
      <header className="fixed left-0 top-0 z-60 w-full py-5 md:py-6">
        <nav
          aria-label="Primary navigation"
          className="flex w-full items-center justify-between gap-6 px-5 md:px-7 lg:px-8"
        >
          <Link
            href={homePath}
            aria-label="Defora home"
            className="group inline-flex h-12 items-center gap-2.5 rounded-full border border-white/10 bg-[#0D172B]/30 px-3.5 backdrop-blur-md transition duration-500 ease-out hover:border-white/18 hover:bg-white/[0.055]"
            onClick={handleHomeClick}
          >
            <Image
              src="/brand/defora-logo.png"
              alt=""
              width={1054}
              height={977}
              priority
              className="h-8 w-8 object-contain transition duration-500 group-hover:scale-[1.02] md:h-9 md:w-9"
            />
            <span className="flex flex-col leading-none">
              <span className="text-[1.55rem] font-semibold tracking-tight text-white md:text-[1.7rem]">
                Defora
              </span>
              <span className="mt-1 text-[0.48rem] font-medium uppercase tracking-[0.42em] text-white/78 md:text-[0.52rem]">
                Digital
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSwitch locale={locale} className="hidden sm:inline-flex" />
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls="site-menu"
              onClick={() => setIsOpen((current) => !current)}
              className="min-h-12 rounded-full border border-white/22 bg-white/[0.045] px-5 py-2.5 text-[0.8rem] font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-md transition duration-500 ease-out hover:scale-[1.015] hover:border-white/38 hover:bg-white/[0.09] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/25 md:px-6"
            >
              {isOpen ? "Close" : "Menu"}
            </button>
          </div>
        </nav>
      </header>

      <div
        id="site-menu"
        ref={overlayRef}
        className="invisible fixed inset-0 z-50 bg-black/18 opacity-0 backdrop-blur-[1px]"
        onClick={() => setIsOpen(false)}
      >
        <div
          ref={panelRef}
          className="ml-auto flex min-h-screen w-[min(100vw,40rem)] flex-col justify-center overflow-hidden rounded-l-[4rem] border-l border-white/10 bg-[#0B0B0B] px-7 pb-12 pt-28 shadow-[-34px_0_90px_rgba(0,0,0,0.28)] md:w-[clamp(22rem,40vw,42rem)] md:rounded-l-[5rem] md:px-10"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex w-full flex-col">
            <div>
              <div className="flex flex-col gap-7 md:gap-9">
                {menuLinks[locale].map(({ label, target }, index) => (
                  <Link
                    key={label}
                    href={`${homePath}#${target}`}
                    ref={(node) => {
                      linkRefs.current[index] = node;
                    }}
                    onClick={() => setIsOpen(false)}
                    className="group relative w-fit overflow-visible text-[clamp(3.12rem,4.64vw,5rem)] font-medium leading-[1.02] tracking-[-0.03em] text-white after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-500 after:ease-out hover:after:scale-x-100"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <LanguageSwitch locale={locale} className="mt-12" />
          </div>
        </div>
      </div>
    </>
  );
}
