"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/i18n";

type ServiceItem = {
  label: string;
  title: string;
  description: string;
  bullets: string[];
  icon: "globe" | "bag" | "phone" | "panel" | "rocket" | "stack";
};

type SectionCopy = {
  eyebrow: string;
  heading: string;
  subtext: string;
  closing: string;
  services: ServiceItem[];
};

const sectionCopy: Record<Locale, SectionCopy> = {
  tr: {
    eyebrow: "HİZMETLER",
    heading: "İhtiyacınız olan dijital ürünü tasarlıyor, geliştiriyor ve yayına alıyoruz.",
    subtext:
      "Web sitesi, e-ticaret, mobil uygulama, özel yazılım, MVP ve SaaS çözümlerini fikirden yayına kadar tek sistemde geliştiriyoruz.",
    closing: "Fikirden yayına, çalışan dijital ürünler geliştiriyoruz.",
    services: [
      {
        label: "01",
        title: "Web Sitesi",
        description:
          "Markanızı güçlü gösteren, hızlı çalışan ve güven veren web siteleri geliştiriyoruz.",
        bullets: ["Kurumsal site", "Landing page", "Teknik altyapı"],
        icon: "globe",
      },
      {
        label: "02",
        title: "E-Ticaret",
        description:
          "Ürünlerinizi online satabileceğiniz, yönetilebilir ve ölçeklenebilir e-ticaret sistemleri kuruyoruz.",
        bullets: ["Ödeme altyapısı", "Sipariş yönetimi", "Kargo entegrasyonu"],
        icon: "bag",
      },
      {
        label: "03",
        title: "Mobil Uygulama",
        description:
          "Fikrinizi iOS ve Android’e taşıyan modern, performans odaklı mobil uygulamalar geliştiriyoruz.",
        bullets: ["iOS & Android", "Kullanıcı akışları", "API entegrasyonları"],
        icon: "phone",
      },
      {
        label: "04",
        title: "Özel Yazılım / CRM",
        description:
          "İş süreçlerinizi kolaylaştıran, size özel panel, CRM ve operasyon sistemleri geliştiriyoruz.",
        bullets: ["Yönetim paneli", "CRM sistemi", "Otomasyon akışları"],
        icon: "panel",
      },
      {
        label: "05",
        title: "MVP Geliştirme",
        description:
          "Fikrinizi hızlıca test edebilmeniz için minimum ama çalışan ürünler geliştiriyoruz.",
        bullets: ["Hızlı prototipleme", "Temel kullanıcı akışı", "Yayına hazır yapı"],
        icon: "rocket",
      },
      {
        label: "06",
        title: "SaaS Ürün Geliştirme",
        description:
          "Abonelik modeliyle çalışan modern yazılım ürünlerini baştan sona tasarlıyor ve geliştiriyoruz.",
        bullets: ["Çok kullanıcılı yapı", "Abonelik sistemi", "Ölçeklenebilir mimari"],
        icon: "stack",
      },
    ],
  },
  en: {
    eyebrow: "SERVICES",
    heading: "We design, build, and launch the digital product your business actually needs.",
    subtext:
      "From websites and ecommerce to mobile apps, custom software, MVPs, and SaaS products, we build the full system from idea to launch.",
    closing: "From idea to launch, we build digital products that work.",
    services: [
      {
        label: "01",
        title: "Website",
        description:
          "We build fast, credible websites that present your brand clearly and create trust from the first visit.",
        bullets: ["Corporate site", "Landing page", "Technical setup"],
        icon: "globe",
      },
      {
        label: "02",
        title: "Ecommerce",
        description:
          "We create manageable, scalable ecommerce systems designed to help you sell online with confidence.",
        bullets: ["Payment setup", "Order management", "Shipping integration"],
        icon: "bag",
      },
      {
        label: "03",
        title: "Mobile App",
        description:
          "We turn your idea into modern, performance-led mobile apps for iOS and Android.",
        bullets: ["iOS & Android", "User flows", "API integrations"],
        icon: "phone",
      },
      {
        label: "04",
        title: "Custom Software / CRM",
        description:
          "We build custom dashboards, CRM systems, and operational software tailored to how your business runs.",
        bullets: ["Admin panel", "CRM system", "Automation flows"],
        icon: "panel",
      },
      {
        label: "05",
        title: "MVP Development",
        description:
          "We build lean but working products that help you test and validate your idea quickly.",
        bullets: ["Rapid prototyping", "Core user flow", "Launch-ready setup"],
        icon: "rocket",
      },
      {
        label: "06",
        title: "SaaS Product Development",
        description:
          "We design and build subscription-based software products from the ground up.",
        bullets: ["Multi-tenant setup", "Subscription system", "Scalable architecture"],
        icon: "stack",
      },
    ],
  },
};

function ServiceIcon({ icon }: { icon: ServiceItem["icon"] }) {
  const base = "h-[1.05rem] w-[1.05rem] stroke-current";

  switch (icon) {
    case "globe":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={base} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14.5 14.5 0 0 1 0 18" />
          <path d="M12 3a14.5 14.5 0 0 0 0 18" />
        </svg>
      );
    case "bag":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={base} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 8h14l-1 11H6L5 8Z" />
          <path d="M9 9V7a3 3 0 0 1 6 0v2" />
        </svg>
      );
    case "phone":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={base} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="7" y="3.5" width="10" height="17" rx="2.2" />
          <path d="M10 6.5h4" />
          <circle cx="12" cy="17.2" r="0.75" fill="currentColor" stroke="none" />
        </svg>
      );
    case "panel":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={base} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3.5" y="4" width="17" height="16" rx="2" />
          <path d="M9 4v16" />
          <path d="M12 9h5" />
          <path d="M12 13h5" />
        </svg>
      );
    case "rocket":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={base} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 4.5c2.8 0 4.5 1.8 4.5 4.5 0 4.7-4 8-8.8 8.8l-2.7-2.7C8 10 11.3 6 16 6Z" />
          <path d="M8.5 15.5 5 19" />
          <path d="M9 9l6 6" />
        </svg>
      );
    case "stack":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={base} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 4 8 4-8 4-8-4 8-4Z" />
          <path d="m4 12 8 4 8-4" />
          <path d="m4 16 8 4 8-4" />
        </svg>
      );
  }
}

export default function GrowthSystem({ locale }: { locale: Locale }) {
  const copy = sectionCopy[locale];
  const rootRef = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const closingRef = useRef<HTMLParagraphElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const glowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const iconRefs = useRef<Array<HTMLDivElement | null>>([]);
  const titleRefs = useRef<Array<HTMLHeadingElement | null>>([]);
  const bodyRefs = useRef<Array<HTMLDivElement | null>>([]);
  const bulletRefs = useRef<Array<HTMLUListElement | null>>([]);

  useLayoutEffect(() => {
    const section = rootRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const cleanupFns: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const cards = cardRefs.current.filter((card): card is HTMLElement => Boolean(card));
      const introNodes = introRef.current
        ? Array.from(introRef.current.children).filter(
            (node): node is HTMLElement => node instanceof HTMLElement,
          )
        : [];

      if (prefersReducedMotion) {
        gsap.set([...introNodes, ...cards, closingRef.current].filter(Boolean), {
          autoAlpha: 1,
          clearProps: "transform,filter",
        });
        return;
      }

      gsap.set([...introNodes, ...cards, closingRef.current].filter(Boolean), {
        autoAlpha: 0,
        y: 24,
        filter: "blur(6px)",
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 76%",
          once: true,
        },
      })
        .to(introNodes, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.82,
          ease: "power3.out",
          stagger: 0.08,
        })
        .to(
          cards,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.92,
            ease: "power3.out",
            stagger: 0.1,
          },
          "-=0.35",
        )
        .to(
          closingRef.current,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.78,
            ease: "power3.out",
          },
          "-=0.3",
        );

      cards.forEach((card, index) => {
        const glow = glowRefs.current[index];
        const icon = iconRefs.current[index];
        const title = titleRefs.current[index];
        const body = bodyRefs.current[index];
        const bullets = bulletRefs.current[index];

        const enter = () => {
          const tl = gsap.timeline({ defaults: { duration: 0.42, ease: "power3.out", overwrite: "auto" } });
          tl.to(card, {
            y: -6,
            borderColor: "rgba(255,255,255,0.20)",
            backgroundColor: "rgba(10,18,34,0.78)",
          }, 0)
            .to(glow, { opacity: 0.18 }, 0)
            .to(icon, { scale: 1.04 }, 0)
            .to(title, { y: -4 }, 0)
            .to(body, { opacity: 0.9 }, 0)
            .to(bullets, { y: -6, opacity: 0.9 }, 0);
        };

        const leave = () => {
          const tl = gsap.timeline({ defaults: { duration: 0.36, ease: "power3.out", overwrite: "auto" } });
          tl.to(card, {
            y: 0,
            borderColor: "rgba(255,255,255,0.10)",
            backgroundColor: "rgba(8,16,31,0.64)",
          }, 0)
            .to(glow, { opacity: 0.08 }, 0)
            .to(icon, { scale: 1 }, 0)
            .to(title, { y: 0 }, 0)
            .to(body, { opacity: 0.72 }, 0)
            .to(bullets, { y: 0, opacity: 0.72 }, 0);
        };

        card.addEventListener("mouseenter", enter);
        card.addEventListener("mouseleave", leave);
        cleanupFns.push(() => {
          card.removeEventListener("mouseenter", enter);
          card.removeEventListener("mouseleave", leave);
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
      className="relative overflow-hidden bg-[#050b14] px-5 py-16 text-white md:px-8 md:py-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(76,124,255,0.08),transparent_28%),radial-gradient(circle_at_84%_78%,rgba(118,82,255,0.08),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.015),transparent_24%,transparent_76%,rgba(255,255,255,0.015))]" />

      <div className="relative mx-auto max-w-[92rem]">
        <div ref={introRef} className="max-w-[54rem]">
          <p className="text-[0.76rem] font-medium uppercase tracking-[0.24em] text-white/46 md:text-[0.8rem]">
            {copy.eyebrow}
          </p>
          <h2 className="mt-5 max-w-[20ch] text-[clamp(2.2rem,5.6vw,5rem)] font-medium leading-[0.97] tracking-[-0.05em] text-white">
            {copy.heading}
          </h2>
          <p className="mt-5 max-w-[44rem] text-[1rem] leading-[1.75] text-white/58 md:text-[1.05rem]">
            {copy.subtext}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
          {copy.services.map((service, index) => (
            <article
              key={service.title}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[rgba(8,16,31,0.64)] p-5 backdrop-blur-[14px] md:min-h-[24rem] md:p-6"
            >
              <div
                ref={(node) => {
                  glowRefs.current[index] = node;
                }}
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                  background:
                    "radial-gradient(circle at top left, rgba(115,147,255,0.16), transparent 36%), radial-gradient(circle at bottom right, rgba(116,78,255,0.12), transparent 32%)",
                }}
              />
              <div className="pointer-events-none absolute inset-[1px] rounded-[calc(1.75rem-1px)] border border-white/[0.04]" />

              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[0.72rem] font-medium uppercase tracking-[0.22em] text-white/38">
                    {service.label}
                  </span>
                  <div
                    ref={(node) => {
                      iconRefs.current[index] = node;
                    }}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-white/74"
                  >
                    <ServiceIcon icon={service.icon} />
                  </div>
                </div>

                <h3
                  ref={(node) => {
                    titleRefs.current[index] = node;
                  }}
                  className="mt-7 text-[1.6rem] font-medium leading-[1.05] tracking-[-0.035em] text-white md:text-[1.72rem]"
                >
                  {service.title}
                </h3>

                <div
                  ref={(node) => {
                    bodyRefs.current[index] = node;
                  }}
                  className="mt-4 text-[0.98rem] leading-[1.7] text-white/72"
                >
                  <p>{service.description}</p>
                </div>

                <ul
                  ref={(node) => {
                    bulletRefs.current[index] = node;
                  }}
                  className="mt-auto flex flex-col gap-3 pt-8 text-[0.9rem] leading-[1.5] text-white/72"
                >
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2.5">
                      <span className="h-1 w-1 rounded-full bg-white/42" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <p
          ref={closingRef}
          className="mt-8 text-[0.95rem] leading-[1.7] text-white/48 md:mt-10 md:text-base"
        >
          {copy.closing}
        </p>
      </div>
    </section>
  );
}
