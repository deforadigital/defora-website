"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { openBooking } from "@/lib/cal";
import type { Locale } from "@/lib/i18n";

const sectionCopy: Record<
  Locale,
  {
    heading: string;
    support: string;
    whatsappLabel: string;
    meetingLabel: string;
    phoneLabel: string;
    phoneValue: string;
    emailLabel: string;
    emailValue: string;
    addressLabel: string;
    addressValue: string[];
    namePlaceholder: string;
    contactPlaceholder: string;
    projectPlaceholder: string;
    submitLabel: string;
    responseNote: string;
    successMessage: string;
    errorMessage: string;
    whatsappMessage: string;
  }
> = {
  tr: {
    heading: "İletişime geçmek zor olmak zorunda değil.",
    support: "En hızlı yol WhatsApp. İsterseniz kısa bir form bırakabilirsiniz.",
    whatsappLabel: "WhatsApp’tan yaz",
    meetingLabel: "Kısa bir görüşme planla",
    phoneLabel: "Telefon",
    phoneValue: "0540 033 3672",
    emailLabel: "E-posta",
    emailValue: "contact@deforadigital.com",
    addressLabel: "Adres",
    addressValue: [
      "Kızılarık, Kızılırmak Cd. No:80, daire 5",
      "07310 Muratpaşa/Antalya",
    ],
    namePlaceholder: "İsminiz",
    contactPlaceholder: "Telefon veya e-posta",
    projectPlaceholder: "Projenizi kısaca anlatın",
    submitLabel: "Gönder",
    responseNote: "Genellikle aynı gün içinde dönüş yapıyoruz.",
    successMessage: "Mesajınız alındı. En kısa sürede dönüş yapacağız.",
    errorMessage: "Bir hata oluştu. Lütfen tekrar deneyin.",
    whatsappMessage: "Merhaba, Defora ile projem hakkında konuşmak istiyorum.",
  },
  en: {
    heading: "Getting in touch should not feel complicated.",
    support: "WhatsApp is the fastest route. If you prefer, you can leave a short form.",
    whatsappLabel: "WhatsApp us",
    meetingLabel: "Schedule a short call",
    phoneLabel: "Phone",
    phoneValue: "+1 571 600 6092",
    emailLabel: "Email",
    emailValue: "contact@deforadigital.com",
    addressLabel: "Address",
    addressValue: [
      "Kızılarık, Kızılırmak Cd. No:80, daire 5",
      "07310 Muratpaşa/Antalya",
    ],
    namePlaceholder: "Your name",
    contactPlaceholder: "Phone or email",
    projectPlaceholder: "Tell us briefly about the project",
    submitLabel: "Send",
    responseNote: "We usually reply the same day.",
    successMessage: "Mesajınız alındı. En kısa sürede dönüş yapacağız.",
    errorMessage: "Bir hata oluştu. Lütfen tekrar deneyin.",
    whatsappMessage: "Hello, I’d like to talk about my project with Defora.",
  },
};

const contactDetails: Record<
  Locale,
  { phoneHref: string; whatsappHref: string; displayPhone: string }
> = {
  tr: {
    phoneHref: "tel:+905400333672",
    whatsappHref: "https://wa.me/905400333672",
    displayPhone: "0540 033 3672",
  },
  en: {
    phoneHref: "tel:+15716006092",
    whatsappHref: "https://wa.me/15716006092",
    displayPhone: "+1 571 600 6092",
  },
};

export default function FinalCta({ locale }: { locale: Locale }) {
  const copy = sectionCopy[locale];
  const rootRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [formValues, setFormValues] = useState({
    name: "",
    contact: "",
    message: "",
    website: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">("idle");

  const whatsappHref = `${contactDetails[locale].whatsappHref}?text=${encodeURIComponent(copy.whatsappMessage)}`;

  const handleBookingAction = () => {
    void openBooking(locale);
  };

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

    const payload = {
      name: formValues.name.trim(),
      contact: formValues.contact.trim(),
      message: formValues.message.trim(),
      website: formValues.website.trim(),
      locale,
    };

    if (!payload.contact || !payload.message) {
      console.warn("[contact-form] validation failed", {
        hasContact: Boolean(payload.contact),
        hasMessage: Boolean(payload.message),
      });
      setSubmitState("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitState("idle");

    try {
      console.log("[contact-form] submitting payload", {
        ...payload,
        website: payload.website ? "[filled]" : "",
      });
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);
      console.log("[contact-form] API response", {
        ok: response.ok,
        status: response.status,
        result,
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
        y: 12,
        filter: "blur(4px)",
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 84%",
          once: true,
        },
      }).to(items, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.54,
        ease: "power3.out",
        stagger: 0.08,
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={rootRef}
      className="relative overflow-hidden bg-[#040913] px-5 py-14 text-white md:px-8 md:py-16"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/8" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_64%)]" />

      <div className="relative mx-auto max-w-[92rem]">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(21rem,30rem)] md:gap-12">
          <div
            ref={(node) => {
              itemRefs.current[0] = node;
            }}
            className="max-w-[40rem]"
          >
            <h2 className="text-[clamp(2rem,4vw,4.2rem)] font-medium leading-[1.02] tracking-[-0.045em] text-white">
              {copy.heading}
            </h2>
            <p className="mt-3 max-w-[32rem] text-base leading-[1.68] text-white/60 md:text-lg">
              {copy.support}
            </p>

            <div className="mt-6 flex flex-col items-start gap-2.5 md:mt-7 md:flex-row md:flex-wrap">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-13 items-center justify-center bg-white px-6 text-[0.72rem] font-medium uppercase tracking-[0.28em] text-[#050b14] transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/92 active:translate-y-0 md:h-14 md:px-8"
              >
                {copy.whatsappLabel}
              </a>

              <button
                type="button"
                onClick={handleBookingAction}
                className="inline-flex h-13 items-center justify-center border border-white/20 px-6 text-[0.72rem] font-medium uppercase tracking-[0.28em] text-white transition duration-300 ease-out hover:-translate-y-0.5 hover:border-white/36 hover:bg-white/7 active:translate-y-0 md:h-14 md:px-8"
              >
                {copy.meetingLabel}
              </button>
            </div>
          </div>

          <div className="space-y-7 md:space-y-8">
            <div
              ref={(node) => {
                itemRefs.current[1] = node;
              }}
              className="grid gap-4 text-sm leading-[1.65] text-white/44"
            >
              <div className="grid gap-1">
                <span className="uppercase tracking-[0.22em]">{copy.phoneLabel}</span>
                <a
                  href={contactDetails[locale].phoneHref}
                  className="text-white/68 transition hover:text-white/84"
                >
                  {contactDetails[locale].displayPhone}
                </a>
              </div>

              <div className="grid gap-1">
                <span className="uppercase tracking-[0.22em]">{copy.emailLabel}</span>
                <a
                  href={`mailto:${copy.emailValue}`}
                  className="text-white/68 transition hover:text-white/84"
                >
                  {copy.emailValue}
                </a>
              </div>

              <div className="grid gap-1">
                <span className="uppercase tracking-[0.22em]">{copy.addressLabel}</span>
                <div className="text-white/44">
                  {copy.addressValue.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </div>

            <div
              ref={(node) => {
                itemRefs.current[2] = node;
              }}
            >
              <form onSubmit={handleFormSubmit} className="grid gap-3">
                <input
                  type="text"
                  name="name"
                  placeholder={copy.namePlaceholder}
                  value={formValues.name}
                  onChange={handleInputChange}
                  className="h-12 border-b border-white/12 bg-transparent px-0 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/28"
                />
                <input
                  type="text"
                  name="contact"
                  placeholder={copy.contactPlaceholder}
                  value={formValues.contact}
                  onChange={handleInputChange}
                  className="h-12 border-b border-white/12 bg-transparent px-0 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/28"
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
                  rows={4}
                  className="min-h-28 border-b border-white/12 bg-transparent px-0 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/28"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 inline-flex h-12 items-center justify-center self-start border border-white/16 px-6 text-[0.72rem] font-medium uppercase tracking-[0.28em] text-white transition duration-300 ease-out hover:-translate-y-0.5 hover:border-white/34 hover:bg-white/7 active:translate-y-0 disabled:translate-y-0 disabled:border-white/12 disabled:text-white/45 disabled:hover:bg-transparent"
                >
                  {isSubmitting ? "Gönderiliyor" : copy.submitLabel}
                </button>
              </form>

              <p className="mt-4 text-sm leading-[1.6] text-white/40">{copy.responseNote}</p>
              {submitState === "success" ? (
                <p className="mt-2 text-sm leading-[1.6] text-white/68">{copy.successMessage}</p>
              ) : null}
              {submitState === "error" ? (
                <p className="mt-2 text-sm leading-[1.6] text-white/68">{copy.errorMessage}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
