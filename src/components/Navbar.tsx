"use client";

import {
  type MouseEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import LanguageSwitch from "@/components/LanguageSwitch";
import { type Locale, localizePathname } from "@/lib/i18n";

const navLinks: Record<Locale, Array<{ label: string; target: string }>> = {
  tr: [
    { label: "Hizmetler", target: "services" },
    { label: "Yaklaşım", target: "about" },
    { label: "İletişim", target: "contact" },
  ],
  en: [
    { label: "Services", target: "services" },
    { label: "Approach", target: "about" },
    { label: "Contact", target: "contact" },
  ],
};
const whatsappLinks: Record<Locale, { label: string; href: string; message: string }> = {
  tr: {
    label: "WhatsApp",
    href: "https://wa.me/905400333672",
    message: "Merhaba, Defora ile projem hakkında konuşmak istiyorum.",
  },
  en: {
    label: "WhatsApp",
    href: "https://wa.me/15716006092",
    message: "Hello, I’d like to talk about my project with Defora.",
  },
};
const phoneLinks: Record<Locale, { label: string; href: string }> = {
  tr: {
    label: "Telefon ile ara",
    href: "tel:+905400333672",
  },
  en: {
    label: "Call us",
    href: "tel:+15716006092",
  },
};

const panelEase = "power3.out";
const linkEase = "power3.out";

export default function Navbar({ locale }: { locale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTarget, setActiveTarget] = useState<string>("services");
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const homePath = localizePathname("/", locale);
  const links = navLinks[locale];
  const whatsappHref = `${whatsappLinks[locale].href}?text=${encodeURIComponent(
    whatsappLinks[locale].message,
  )}`;
  const phoneHref = phoneLinks[locale].href;

  const isHomePage = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.location.pathname === homePath;
  }, [homePath]);

  const scrollToTarget = (target: string) => {
    const element = document.getElementById(target);
    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    target: string,
    closeMenu = false,
  ) => {
    const href = `${homePath}#${target}`;

    if (closeMenu) {
      setIsOpen(false);
    }

    if (!isHomePage) return;

    event.preventDefault();
    setActiveTarget(target);
    requestAnimationFrame(() => {
      scrollToTarget(target);
      window.history.replaceState(null, "", href);
    });
  };

  const handleHomeClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setIsOpen(false);

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

  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    if (!panel) return;

    const focusableElements = Array.from(
      panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab" || !focusableElements.length) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isHomePage) return;

    const sections = links
      .map(({ target }) => document.getElementById(target))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visibleEntries.length) return;
        setActiveTarget(visibleEntries[0].target.id);
      },
      {
        rootMargin: "-42% 0px -42% 0px",
        threshold: [0.2, 0.35, 0.5, 0.65],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [isHomePage, links]);

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
            duration: 0.32,
            ease: "power2.out",
          },
        )
        .fromTo(
          panel,
          {
            clipPath: "inset(0 0 0 100%)",
            autoAlpha: 1,
            xPercent: 2,
          },
          {
            clipPath: "inset(0 0 0 0%)",
            autoAlpha: 1,
            xPercent: 0,
            duration: 0.38,
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
            duration: 0.4,
            stagger: 0.04,
            ease: linkEase,
          },
          0.1,
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
        y: -6,
        duration: 0.18,
        stagger: 0.02,
        ease: "power3.in",
      })
      .to(
        panel,
        {
          clipPath: "inset(0 0 0 100%)",
          xPercent: 2,
          duration: 0.3,
          ease: panelEase,
        },
        0,
      )
      .to(
        overlay,
        {
          autoAlpha: 0,
          duration: 0.24,
          ease: "power2.inOut",
        },
        0.06,
      );
  }, [isOpen]);

  return (
    <>
      <header className="fixed left-0 top-0 z-60 w-full py-5 md:py-6">
        <nav
          aria-label="Primary navigation"
          className="flex w-full items-center justify-between gap-6 px-6 md:px-8 lg:px-10"
        >
          <Link
            href={homePath}
            aria-label="Defora home"
            className="group inline-flex h-12 items-center justify-center rounded-full border border-white/12 bg-[#0D172B]/34 px-5 backdrop-blur-md transition duration-500 ease-out hover:border-white/20 hover:bg-white/[0.06] md:h-14 md:px-6"
            onClick={handleHomeClick}
          >
            <Image
              src="/brand/defora-navbar-logo.svg"
              alt="Company logo"
              width={2000}
              height={2000}
              priority
              className="h-8 w-auto object-contain transition duration-500 group-hover:scale-[1.01] md:h-[2.5rem]"
            />
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSwitch locale={locale} />
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls="site-menu"
              onClick={() => setIsOpen((current) => !current)}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/22 bg-white/[0.045] px-5 py-2.5 text-[0.8rem] font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-md transition duration-200 ease-out hover:-translate-y-0.5 hover:border-white/34 hover:bg-white/[0.08] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/25 md:px-6"
            >
              {isOpen ? "Close" : locale === "tr" ? "Menü" : "Menu"}
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
          className="ml-auto flex min-h-screen w-[min(100vw,34rem)] flex-col overflow-hidden rounded-l-[3rem] border-l border-white/10 bg-[#0B0B0B] px-7 pb-12 pt-10 shadow-[-24px_0_60px_rgba(0,0,0,0.22)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex w-full flex-1 flex-col">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white/42">
                {locale === "tr" ? "Menü" : "Menu"}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/14 px-4 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/76 transition duration-200 ease-out hover:border-white/26 hover:bg-white/[0.05] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                {locale === "tr" ? "Kapat" : "Close"}
              </button>
            </div>
            <div className="mt-14">
              <div className="flex flex-col gap-6">
                {links.map(({ label, target }, index) => (
                  <Link
                    key={label}
                    href={`${homePath}#${target}`}
                    ref={(node) => {
                      linkRefs.current[index] = node;
                    }}
                    onClick={(event) => handleNavClick(event, target, true)}
                    className={`group relative w-fit overflow-visible text-[clamp(2.6rem,10vw,4rem)] font-medium leading-[1.02] tracking-[-0.03em] transition duration-200 ease-out hover:-translate-y-0.5 ${
                      activeTarget === target ? "text-white" : "text-white/68"
                    }`}
                  >
                    {label}
                    <span
                      className={`absolute -bottom-2 left-0 h-px w-full origin-left bg-white transition duration-200 ease-out ${
                        activeTarget === target ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                      }`}
                    />
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-10 flex flex-col items-start gap-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                ref={(node) => {
                  linkRefs.current[links.length] = node;
                }}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/16 px-4 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/82 transition duration-200 ease-out hover:-translate-y-0.5 hover:border-white/28 hover:bg-white/[0.06] hover:text-white"
              >
                {locale === "tr" ? "WhatsApp’tan yaz" : "WhatsApp"}
              </a>
              <a
                href={phoneHref}
                ref={(node) => {
                  linkRefs.current[links.length + 1] = node;
                }}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 px-4 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/62 transition duration-200 ease-out hover:-translate-y-0.5 hover:border-white/24 hover:bg-white/[0.05] hover:text-white/84"
              >
                {phoneLinks[locale].label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
