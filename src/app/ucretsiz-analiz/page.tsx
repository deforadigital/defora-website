import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Ücretsiz Dijital Analiz Araçları | Defora Digital",
  description:
    "Web sitenizi ve Google işletme profilinizi ücretsiz analiz edin. Defora Digital'in ücretsiz araçlarıyla dijital varlığınızı güçlendirin.",
};

const tools = [
  {
    title: "Web Sitesi Analizi",
    description:
      "Sitenizin Google'da ne kadar iyi göründüğünü öğrenin. Teknik sorunlar, SEO eksikleri, hız problemleri.",
    buttonLabel: "Analiz Et",
    href: "/ucretsiz-web-site-analizi",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9Z" />
      </svg>
    ),
  },
  {
    title: "Google İşletme Skoru",
    description:
      "Google profiliniz müşteri kazanıyor mu? Eksiklerinizi görün, rakiplerinizin önüne geçin.",
    buttonLabel: "Skoru Gör",
    href: "/google-isletme-skoru",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10.5c0 5.5-8 11.5-8 11.5s-8-6-8-11.5a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10.5" r="2.6" />
      </svg>
    ),
  },
];

export default function UcretsizAnalizPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07101f] text-white">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[url('/brand/defora-abstract-bg.svg')] bg-cover bg-[56%_46%] opacity-40 saturate-[0.68] contrast-[1.08]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(105deg,rgba(3,8,18,0.92)_0%,rgba(7,16,31,0.82)_42%,rgba(6,10,18,0.92)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_16%_18%,rgba(0,233,255,0.12),transparent_28%),radial-gradient(circle_at_84%_12%,rgba(177,87,253,0.13),transparent_31%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-white/8" />

      <Navbar locale="tr" />

      <div className="relative z-10">
        <header className="flex flex-col items-center gap-5 px-6 pb-14 pt-28 text-center md:px-10 md:pb-20 md:pt-36">
          <p className="text-[0.76rem] font-medium uppercase tracking-[0.28em] text-white/42 md:text-[0.8rem]">
            ÜCRETSİZ ARAÇLAR
          </p>
          <h1 className="max-w-[24ch] text-[clamp(2rem,5vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.04em] text-white">
            Hangi analizi yapmak istiyorsunuz?
          </h1>
          <p className="max-w-[34rem] text-[1rem] leading-[1.75] text-white/64 md:text-[1.06rem]">
            İki aracımızdan birini seçin, hemen başlayın.
          </p>
        </header>

        <section className="mx-auto grid max-w-[56rem] gap-6 px-4 pb-20 sm:grid-cols-2 md:px-0">
          {tools.map((tool) => (
            <div
              key={tool.href}
              className="relative flex flex-col overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(15,24,43,0.92),rgba(10,17,32,0.82))] p-7 shadow-[0_18px_56px_rgba(0,0,0,0.22)] backdrop-blur-[18px] md:p-8"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,233,255,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(177,87,253,0.1),transparent_32%)] opacity-80" />
              <div className="pointer-events-none absolute inset-[1px] rounded-[calc(2rem-1px)] border border-white/[0.05]" />

              <div className="relative flex flex-1 flex-col">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-[#00e9ff]">
                  {tool.icon}
                </span>
                <h2 className="mt-5 text-[1.3rem] font-medium tracking-[-0.03em] text-white">
                  {tool.title}
                </h2>
                <p className="mt-3 flex-1 text-[0.94rem] leading-[1.7] text-white/64">
                  {tool.description}
                </p>
                <Link
                  href={tool.href}
                  className="mt-6 inline-flex h-14 w-fit items-center justify-center rounded-full bg-[#00e9ff] px-8 text-[0.8rem] font-medium uppercase tracking-[0.16em] text-[#0d172b] transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#33efff]"
                >
                  {tool.buttonLabel}
                </Link>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
