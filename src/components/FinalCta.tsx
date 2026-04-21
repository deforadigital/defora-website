"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/i18n";

const serviceOptions = {
  tr: ["Web Sitesi", "E-Ticaret", "Mobil Uygulama", "Özel Yazılım", "MVP", "SaaS"],
  en: ["Website", "Ecommerce", "Mobile App", "Custom Software", "MVP", "SaaS"],
} as const;

function ContactIcon({ type }: { type: "phone" | "mail" | "pin" }) {
  const base =
    "h-[1rem] w-[1rem] shrink-0 stroke-current text-white/68";

  if (type === "phone") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={base} strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v2.1a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 3.3 2 2 0 0 1 4.11 1h2.1a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.8a2 2 0 0 1-.45 2.11L7.53 8.5a16 16 0 0 0 6 6l.87-.89a2 2 0 0 1 2.11-.45c.9.31 1.84.53 2.8.66A2 2 0 0 1 22 16.92Z" />
      </svg>
    );
  }

  if (type === "mail") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={base} strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6.5h16v11H4z" />
        <path d="m5 8 7 5 7-5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-6-5.33-6-11a6 6 0 1 1 12 0c0 5.67-6 11-6 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

const sectionCopy: Record<
  Locale,
  {
    eyebrow: string;
    heading: string;
    support: string;
    cardTitle: string;
    cardIntro: string;
    namePlaceholder: string;
    contactPlaceholder: string;
    projectPlaceholder: string;
    submitLabel: string;
    submittingLabel: string;
    responseNote: string;
    quickActionLabel: string;
    successMessage: string;
    errorMessage: string;
    emailValue: string;
    phoneValue: string;
    whatsappMessage: string;
  }
> = {
  tr: {
    eyebrow: "İLETİŞİM",
    heading: "Bir sonraki dijital adımınızı birlikte netleştirelim.",
    support:
      "Web sitesi, özel yazılım, MVP veya SaaS fikriniz için en doğru yapıyı birlikte belirleyelim.",
    cardTitle: "Projenizi başlatın",
    cardIntro: "Kısa birkaç bilgi bırakın, size en uygun başlangıç yolunu paylaşalım.",
    namePlaceholder: "Adınız",
    contactPlaceholder: "Telefon veya e-posta",
    projectPlaceholder: "Ne geliştirmek istiyorsunuz?",
    submitLabel: "Mesajınızı Gönderin",
    submittingLabel: "Gönderiliyor",
    responseNote: "Ön görüşmede ihtiyacınızı netleştirip size en uygun yapıyı öneririz.",
    quickActionLabel: "WhatsApp’tan yazın",
    successMessage: "Mesajınız alındı. En kısa sürede dönüş yapacağız.",
    errorMessage: "Bir hata oluştu. Lütfen tekrar deneyin.",
    emailValue: "contact@deforadigital.com",
    phoneValue: "+90 540 033 36 72",
    whatsappMessage: "Merhaba, Defora ile projem hakkında konuşmak istiyorum.",
  },
  en: {
    eyebrow: "CONTACT",
    heading: "Let’s define your next digital step together.",
    support:
      "Whether you are planning a website, custom software, an MVP, or a SaaS product, we can help shape the right starting point. We usually reply the same day.",
    cardTitle: "Start your project",
    cardIntro: "Leave a few details and we’ll suggest the most suitable starting path.",
    namePlaceholder: "Your name",
    contactPlaceholder: "Phone or email",
    projectPlaceholder: "What do you want to build?",
    submitLabel: "Start the conversation",
    submittingLabel: "Sending",
    responseNote: "No pressure. We first understand the need, then recommend the right path.",
    quickActionLabel: "Reach out faster on WhatsApp",
    successMessage: "Mesajınız alındı. En kısa sürede dönüş yapacağız.",
    errorMessage: "Bir hata oluştu. Lütfen tekrar deneyin.",
    emailValue: "contact@deforadigital.com",
    phoneValue: "+1 571 600 6092",
    whatsappMessage: "Hello, I’d like to talk about my project with Defora.",
  },
};

const contactDetails: Record<Locale, { phoneHref: string; whatsappHref: string }> = {
  tr: {
    phoneHref: "tel:+905400333672",
    whatsappHref: "https://wa.me/905400333672",
  },
  en: {
    phoneHref: "tel:+15716006092",
    whatsappHref: "https://wa.me/15716006092",
  },
};

export default function FinalCta({ locale }: { locale: Locale }) {
  const copy = sectionCopy[locale];
  const rootRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [selectedService, setSelectedService] = useState<string>(serviceOptions[locale][0]);
  const [formValues, setFormValues] = useState({
    name: "",
    contact: "",
    message: "",
    website: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">("idle");

  const whatsappHref = `${contactDetails[locale].whatsappHref}?text=${encodeURIComponent(copy.whatsappMessage)}`;

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.currentTarget;
    setSubmitState("idle");
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    const normalizedMessage = formValues.message.trim();
    const payload = {
      name: formValues.name.trim(),
      contact: formValues.contact.trim(),
      message: selectedService
        ? `${locale === "tr" ? "İlgili alan" : "Interested in"}: ${selectedService}\n\n${normalizedMessage}`
        : normalizedMessage,
      website: formValues.website.trim(),
      locale,
    };

    if (!payload.contact || !normalizedMessage) {
      setSubmitState("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitState("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setFormValues({
        name: "",
        contact: "",
        message: "",
        website: "",
      });
      setSelectedService(serviceOptions[locale][0]);
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useLayoutEffect(() => {
    const section = rootRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const items = itemRefs.current.filter((item): item is HTMLDivElement => item !== null);

      if (prefersReducedMotion) {
        gsap.set(items, {
          autoAlpha: 1,
          clearProps: "transform,filter",
        });
        return;
      }

      gsap.set(items, {
        autoAlpha: 0,
        y: 18,
        filter: "blur(6px)",
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          once: true,
        },
      }).to(items, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.64,
        ease: "power3.out",
        stagger: 0.08,
      });

      if (cardRef.current) {
        const card = cardRef.current;
        const handleEnter = () => {
          gsap.to(card, {
            y: -4,
            borderColor: "rgba(255,255,255,0.18)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
            duration: 0.36,
            ease: "power3.out",
            overwrite: "auto",
          });
        };
        const handleLeave = () => {
          gsap.to(card, {
            y: 0,
            borderColor: "rgba(255,255,255,0.12)",
            boxShadow: "0 18px 56px rgba(0,0,0,0.18)",
            duration: 0.34,
            ease: "power3.out",
            overwrite: "auto",
          });
        };

        card.addEventListener("mouseenter", handleEnter);
        card.addEventListener("mouseleave", handleLeave);

        return () => {
          card.removeEventListener("mouseenter", handleEnter);
          card.removeEventListener("mouseleave", handleLeave);
        };
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={rootRef}
      className="relative overflow-hidden bg-[#040913] px-5 py-16 text-white md:px-8 md:py-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(80,126,255,0.12),transparent_28%),radial-gradient(circle_at_82%_70%,rgba(123,86,255,0.1),transparent_26%),radial-gradient(circle_at_54%_46%,rgba(255,255,255,0.03),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:radial-gradient(rgba(255,255,255,0.7)_0.6px,transparent_0.6px)] [background-size:9px_9px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/8" />

      <div className="relative mx-auto max-w-[92rem]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,32rem)] lg:gap-14 xl:gap-18">
          <div
            ref={(node) => {
              itemRefs.current[0] = node;
            }}
            className="max-w-[42rem] pt-2"
          >
            <p className="text-[0.76rem] font-medium uppercase tracking-[0.24em] text-white/42 md:text-[0.8rem]">
              {copy.eyebrow}
            </p>
            <h2 className="mt-5 max-w-[13ch] text-[clamp(2.3rem,4.9vw,5rem)] font-medium leading-[0.98] tracking-[-0.05em] text-white">
              {copy.heading}
            </h2>
            <p className="mt-5 max-w-[36rem] text-[1rem] leading-[1.8] text-white/64 md:text-[1.06rem]">
              {copy.support}
            </p>
            <div className="mt-6 max-w-[32rem] overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-[14px] md:p-8">
              <div className="pointer-events-none absolute inset-[1px] rounded-[calc(1.5rem-1px)] border border-white/[0.04]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(113,150,255,0.12),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(118,82,255,0.08),transparent_32%)] opacity-80" />
              <div className="relative">
                <div className="grid gap-6">
                  <div className="grid grid-cols-[auto_1fr] items-start gap-4.5">
                    <div className="inline-flex h-13 w-13 items-center justify-center rounded-[1.45rem] border border-white/10 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                      <ContactIcon type="phone" />
                    </div>
                    <div className="grid gap-1">
                      <span className="text-[0.78rem] font-medium uppercase tracking-[0.18em] text-white/40">
                        Telefon
                      </span>
                      <a
                        href={contactDetails[locale].phoneHref}
                        className="w-fit text-[1.18rem] leading-[1.5] text-white/84 transition hover:text-white hover:underline"
                      >
                        {copy.phoneValue}
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-[auto_1fr] items-start gap-4.5">
                    <div className="inline-flex h-13 w-13 items-center justify-center rounded-[1.45rem] border border-white/10 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                      <ContactIcon type="mail" />
                    </div>
                    <div className="grid gap-1">
                      <span className="text-[0.78rem] font-medium uppercase tracking-[0.18em] text-white/40">
                        E-posta
                      </span>
                      <a
                        href={`mailto:${copy.emailValue}`}
                        className="w-fit text-[1.18rem] leading-[1.5] text-white/84 transition hover:text-white hover:underline"
                      >
                        {copy.emailValue}
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-[auto_1fr] items-start gap-4.5">
                    <div className="inline-flex h-13 w-13 items-center justify-center rounded-[1.45rem] border border-white/10 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                      <ContactIcon type="pin" />
                    </div>
                    <div className="grid gap-1">
                      <span className="text-[0.78rem] font-medium uppercase tracking-[0.18em] text-white/40">
                        Adres
                      </span>
                      <div className="grid gap-1.5 text-[1.12rem] leading-[1.65] text-white/66">
                        <p>Kızılarık, Kızılırmak Cd. No:80 Daire 5</p>
                        <p>Muratpaşa / Antalya</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={(node) => {
              itemRefs.current[1] = node;
            }}
            className="relative"
          >
            <div className="pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(106,144,255,0.14),transparent_70%)] blur-3xl" />
            <div className="pointer-events-none absolute -right-6 bottom-8 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(118,82,255,0.12),transparent_72%)] blur-3xl" />

            <div
              ref={cardRef}
              className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(15,24,43,0.92),rgba(10,17,32,0.82))] p-5 shadow-[0_18px_56px_rgba(0,0,0,0.18)] backdrop-blur-[18px] md:p-7"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(118,156,255,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(121,82,255,0.12),transparent_30%)] opacity-70" />
              <div className="pointer-events-none absolute inset-[1px] rounded-[calc(2rem-1px)] border border-white/[0.05]" />

              <div className="relative">
                <h3 className="text-[1.55rem] font-medium tracking-[-0.04em] text-white md:text-[1.7rem]">
                  {copy.cardTitle}
                </h3>
                <p className="mt-2.5 max-w-[28rem] text-[0.98rem] leading-[1.72] text-white/62">
                  {copy.cardIntro}
                </p>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  {serviceOptions[locale].map((service) => {
                    const selected = selectedService === service;
                    return (
                      <button
                        key={service}
                        type="button"
                        onClick={() => setSelectedService(service)}
                        className={`inline-flex items-center rounded-full border px-3.5 py-2 text-[0.72rem] font-medium uppercase tracking-[0.14em] transition duration-200 ease-out ${
                          selected
                            ? "border-white/20 bg-white/10 text-white"
                            : "border-white/10 bg-white/[0.03] text-white/52 hover:border-white/18 hover:text-white/76"
                        }`}
                      >
                        {service}
                      </button>
                    );
                  })}
                </div>

                <form onSubmit={handleFormSubmit} className="mt-7 grid gap-3.5">
                  <input
                    type="text"
                    name="name"
                    placeholder={copy.namePlaceholder}
                    value={formValues.name}
                    onChange={handleInputChange}
                    className="h-13 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-white/28 transition duration-200 focus:border-white/20 focus:bg-white/[0.05]"
                  />
                  <input
                    type="text"
                    name="contact"
                    placeholder={copy.contactPlaceholder}
                    value={formValues.contact}
                    onChange={handleInputChange}
                    className="h-13 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-white/28 transition duration-200 focus:border-white/20 focus:bg-white/[0.05]"
                  />
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formValues.website}
                    onChange={handleInputChange}
                    className="hidden"
                    aria-hidden="true"
                  />
                  <textarea
                    name="message"
                    placeholder={copy.projectPlaceholder}
                    value={formValues.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="min-h-32 rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/28 transition duration-200 focus:border-white/20 focus:bg-white/[0.05]"
                  />

                  <div className="mt-1 flex flex-col items-start gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex h-13 items-center justify-center rounded-full bg-white px-6 text-[0.76rem] font-medium uppercase tracking-[0.2em] text-[#07101f] transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/94 disabled:translate-y-0 disabled:bg-white/70"
                    >
                      {isSubmitting ? copy.submittingLabel : copy.submitLabel}
                    </button>

                    <p className="max-w-[28rem] text-sm leading-[1.65] text-white/42">
                      {copy.responseNote}
                    </p>

                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-13 items-center gap-2.5 rounded-full border border-white/14 bg-white/[0.035] px-6 text-[0.78rem] font-medium tracking-[0.08em] text-white/82 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-white/22 hover:bg-white/[0.06] hover:text-white"
                    >
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#7bd1ff]/20 bg-[linear-gradient(180deg,rgba(76,184,255,0.16),rgba(136,90,255,0.12))] text-white/90">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="h-[0.92rem] w-[0.92rem]"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 11.2A8 8 0 0 1 8.36 18.3L4 20l1.56-4.14A8 8 0 1 1 20 11.2Z" />
                          <path d="M9 10.2c.18 1.18 1.62 2.62 2.8 2.8" />
                          <path d="M14.55 13.95c-.26.73-1.34.92-2.42.4a6.44 6.44 0 0 1-2.48-2.48c-.52-1.08-.33-2.16.4-2.42" />
                        </svg>
                      </span>
                      {copy.quickActionLabel}
                    </a>
                  </div>
                </form>

                {submitState === "success" ? (
                  <p className="mt-4 text-sm leading-[1.6] text-white/72">{copy.successMessage}</p>
                ) : null}
                {submitState === "error" ? (
                  <p className="mt-4 text-sm leading-[1.6] text-white/72">{copy.errorMessage}</p>
                ) : null}

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
