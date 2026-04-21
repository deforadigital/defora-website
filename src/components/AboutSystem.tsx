"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/i18n";

type AboutCard = {
  title: string;
  text: string;
};

type AboutCopy = {
  eyebrow: string;
  heading: string;
  paragraph: string;
  cards: AboutCard[];
  stripItems: string[];
};

const aboutCopy: Record<Locale, AboutCopy> = {
  tr: {
    eyebrow: "HAKKIMIZDA",
    heading: "Defora, Antalya merkezli bir dijital ürün ve yazılım stüdyosudur.",
    paragraph:
      "Web sitesi, e-ticaret, mobil uygulama, özel yazılım, MVP ve SaaS ürünleri geliştiriyoruz. Antalya’da konumlanan ekibimiz; yazılım mühendisleri, tasarım mühendisleri ve yaratıcı tasarımcılardan oluşur. Strateji, tasarım ve geliştirmeyi tek bir sistemde birleştirerek, işletmeler için gerçekten çalışan dijital yapılar kuruyoruz.",
    cards: [
      {
        title: "Biz Kimiz",
        text: "Fikirleri ürüne dönüştüren, işletmelere özel dijital sistemler geliştiren bir ekibiz.",
      },
      {
        title: "Nasıl Çalışıyoruz",
        text: "İhtiyacı analiz eder, doğru yapıyı tasarlar, geliştirir ve yayına aldıktan sonra sürekli iyileştiririz.",
      },
      {
        title: "Neden Defora",
        text: "Sadece tasarım değil, performans, büyüme ve sürdürülebilirlik odaklı sistemler kurarız.",
      },
    ],
    stripItems: [
      "Antalya merkezli ekip",
      "Yazılım + tasarım birlikte",
      "Fikirden yayına",
      "Ölçeklenebilir sistemler",
    ],
  },
  en: {
    eyebrow: "ABOUT",
    heading: "Defora is a digital product and software studio based in Antalya.",
    paragraph:
      "We build websites, ecommerce platforms, mobile apps, custom software, MVPs, and SaaS products. Our Antalya-based team includes software engineers, design engineers, and creative designers. By combining strategy, design, and development in one system, we build digital structures that genuinely work for businesses.",
    cards: [
      {
        title: "Who We Are",
        text: "We are a team that turns ideas into products and builds tailored digital systems for businesses.",
      },
      {
        title: "How We Work",
        text: "We analyze the need, design the right structure, build it, and keep improving it after launch.",
      },
      {
        title: "Why Defora",
        text: "We do not stop at design; we build systems focused on performance, growth, and long-term sustainability.",
      },
    ],
    stripItems: [
      "Antalya-based team",
      "Software + design together",
      "From idea to launch",
      "Scalable systems",
    ],
  },
};

export default function AboutSystem({ locale }: { locale: Locale }) {
  const copy = aboutCopy[locale];
  const rootRef = useRef<HTMLElement | null>(null);
  const introRefs = useRef<Array<HTMLElement | null>>([]);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const glowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const stripRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const section = rootRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const cleanupFns: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const introNodes = introRefs.current.filter((node): node is HTMLElement => Boolean(node));
      const cards = cardRefs.current.filter((node): node is HTMLElement => Boolean(node));
      const targets = [...introNodes, ...cards, stripRef.current].filter(Boolean);

      if (prefersReducedMotion) {
        gsap.set(targets, {
          autoAlpha: 1,
          clearProps: "transform,filter",
        });
        return;
      }

      gsap.set(targets, {
        autoAlpha: 0,
        y: 24,
        filter: "blur(6px)",
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 74%",
          once: true,
        },
      })
        .to(introNodes, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
        })
        .to(
          cards,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
          },
          "-=0.28",
        )
        .to(
          stripRef.current,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.72,
            ease: "power3.out",
          },
          "-=0.22",
        );

      cards.forEach((card, index) => {
        const glow = glowRefs.current[index];

        const enter = () => {
          gsap.to(card, {
            y: -6,
            borderColor: "rgba(255,255,255,0.18)",
            duration: 0.36,
            ease: "power3.out",
            overwrite: "auto",
          });
          gsap.to(glow, {
            opacity: 0.16,
            duration: 0.36,
            ease: "power3.out",
            overwrite: "auto",
          });
        };

        const leave = () => {
          gsap.to(card, {
            y: 0,
            borderColor: "rgba(255,255,255,0.1)",
            duration: 0.34,
            ease: "power3.out",
            overwrite: "auto",
          });
          gsap.to(glow, {
            opacity: 0.08,
            duration: 0.34,
            ease: "power3.out",
            overwrite: "auto",
          });
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
      id="about"
      ref={rootRef}
      className="relative overflow-hidden bg-[#0D172B] px-5 py-16 text-white md:px-8 md:py-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(71,121,255,0.14),transparent_28%),radial-gradient(circle_at_84%_76%,rgba(118,82,255,0.12),transparent_24%),radial-gradient(circle_at_54%_46%,rgba(96,136,255,0.06),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:radial-gradient(rgba(255,255,255,0.7)_0.6px,transparent_0.6px)] [background-size:9px_9px]" />
      <div className="pointer-events-none absolute right-[12%] top-[22%] h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,rgba(110,147,255,0.12),transparent_66%)] blur-3xl" />
      <div className="pointer-events-none absolute left-[52%] top-[32%] h-[18rem] w-[18rem] rounded-full bg-[radial-gradient(circle,rgba(118,82,255,0.09),transparent_68%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/8" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/8" />

      <div className="relative mx-auto max-w-[92rem]">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.08fr)_minmax(19rem,28rem)] md:items-start md:gap-10 lg:gap-14">
          <div className="max-w-[42rem]">
            <p
              ref={(node) => {
                introRefs.current[0] = node;
              }}
              className="text-[0.76rem] font-medium uppercase tracking-[0.24em] text-white/44 md:text-[0.8rem]"
            >
              {copy.eyebrow}
            </p>
            <h2
              ref={(node) => {
                introRefs.current[1] = node;
              }}
              className="mt-5 max-w-[14ch] text-[clamp(2.2rem,5.1vw,4.9rem)] font-medium leading-[0.98] tracking-[-0.05em] text-white"
            >
              {copy.heading}
            </h2>
            <p
              ref={(node) => {
                introRefs.current[2] = node;
              }}
              className="mt-5 max-w-[42rem] text-[1rem] leading-[1.8] text-white/70 md:text-[1.05rem]"
            >
              {copy.paragraph}
            </p>
          </div>

          <div className="space-y-4 md:space-y-4.5">
            {copy.cards.map((card, index) => (
              <article
                key={card.title}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                className="relative overflow-hidden rounded-[1.5rem] border border-white/12 bg-white/[0.055] px-5 py-5 backdrop-blur-[16px] md:px-6 md:py-6"
              >
                <div
                  ref={(node) => {
                    glowRefs.current[index] = node;
                  }}
                  className="pointer-events-none absolute inset-0 opacity-[0.1]"
                  style={{
                    background:
                      "radial-gradient(circle at top left, rgba(113,150,255,0.18), transparent 34%), radial-gradient(circle at bottom right, rgba(118,82,255,0.14), transparent 30%), radial-gradient(circle at center, rgba(255,255,255,0.04), transparent 62%)",
                  }}
                />
                <div className="pointer-events-none absolute inset-[1px] rounded-[calc(1.5rem-1px)] border border-white/[0.035]" />
                <div className="relative">
                  <h3 className="text-[1.15rem] font-medium tracking-[-0.03em] text-white md:text-[1.24rem]">
                    {card.title}
                  </h3>
                  <p className="mt-2.5 text-[0.95rem] leading-[1.72] text-white/64 md:text-[0.98rem]">
                    {card.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div
          ref={stripRef}
          className="mt-10 border-t border-white/10 pt-5 md:mt-12 md:pt-6"
        >
          <div className="flex flex-wrap gap-x-5 gap-y-3 text-[0.78rem] font-medium uppercase tracking-[0.18em] text-white/52 md:gap-x-8 md:text-[0.82rem]">
            {copy.stripItems.map((item) => (
              <span key={item} className="inline-flex items-center gap-2.5">
                <span className="h-px w-5 bg-white/22" />
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
