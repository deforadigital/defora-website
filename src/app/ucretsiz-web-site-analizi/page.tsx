"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AnalysisResult from "@/components/AnalysisResult";

interface ParsedPage {
  title: string;
  description: string;
  h1List: string[];
  h2Count: number;
  hasViewport: boolean;
  hasOgTitle: boolean;
  hasCanonical: boolean;
  imageCount: number;
  imagesMissingAlt: number;
  wordCount: number;
}

interface AnalyzeResponse {
  success: boolean;
  parsed?: ParsedPage;
  analysis?: string;
  error?: string;
}

interface ParsedAnalysis {
  score: number;
  evaluation: string;
  problems: string[];
  suggestions: string[];
}

interface Check {
  name: string;
  value: string;
  status: "ok" | "warn" | "fail";
}

interface AnalysisData {
  score: number;
  url: string;
  checks: Check[];
  evaluation: string;
  problems: string[];
  suggestions: string[];
}

const loadingMessages = [
  "Sayfa taranıyor...",
  "Veriler toplanıyor...",
  "Yapay zeka analiz ediyor...",
  "Rapor hazırlanıyor...",
];

function normalizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    if (!parsed.hostname.includes(".")) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function parseAnalysisText(text: string): ParsedAnalysis {
  const scoreMatch = text.match(/PUAN:\s*(\d+)/i);
  const evaluationMatch = text.match(/DEĞERLENDİRME:\s*([\s\S]*?)(?=SORUNLAR:|$)/i);
  const problemsMatch = text.match(/SORUNLAR:\s*([\s\S]*?)(?=ÖNERİLER:|$)/i);
  const suggestionsMatch = text.match(/ÖNERİLER:\s*([\s\S]*)/i);

  const extractLines = (block: string | undefined): string[] =>
    (block ?? "")
      .split("\n")
      .map((line) => line.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean);

  return {
    score: scoreMatch ? Number(scoreMatch[1]) : 0,
    evaluation: evaluationMatch ? evaluationMatch[1].trim() : "",
    problems: extractLines(problemsMatch?.[1]),
    suggestions: extractLines(suggestionsMatch?.[1]),
  };
}

function buildChecks(parsed: ParsedPage): Check[] {
  return [
    {
      name: "Sayfa Başlığı",
      value: parsed.title || "Bulunamadı",
      status: parsed.title ? "ok" : "fail",
    },
    {
      name: "Açıklama Metni",
      value: parsed.description || "Bulunamadı",
      status: parsed.description ? "ok" : "warn",
    },
    {
      name: "Mobil Uyumluluk",
      value: parsed.hasViewport ? "Var" : "Yok",
      status: parsed.hasViewport ? "ok" : "fail",
    },
    {
      name: "Sosyal Medya Paylaşım Görünümü",
      value: parsed.hasOgTitle ? "Var" : "Yok",
      status: parsed.hasOgTitle ? "ok" : "warn",
    },
    {
      name: "Kopya İçerik Koruması",
      value: parsed.hasCanonical ? "Var" : "Yok",
      status: parsed.hasCanonical ? "ok" : "warn",
    },
    {
      name: "Görsel Açıklamaları",
      value: `${parsed.imageCount} görselden ${parsed.imagesMissingAlt} tanesi eksik`,
      status:
        parsed.imageCount === 0 || parsed.imagesMissingAlt === 0
          ? "ok"
          : parsed.imagesMissingAlt === parsed.imageCount
            ? "fail"
            : "warn",
    },
  ];
}

export default function FreeWebsiteAnalysisPage() {
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingResult, setPendingResult] = useState<AnalysisData | null>(null);
  const [result, setResult] = useState<AnalysisData | null>(null);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadErrorMessage, setLeadErrorMessage] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    setLoadingMessageIndex(0);
    intervalRef.current = setInterval(() => {
      setLoadingMessageIndex((current) => (current + 1) % loadingMessages.length);
    }, 1800);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLoading]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading) return;

    const normalizedUrl = normalizeUrl(urlInput);

    if (!normalizedUrl) {
      setErrorMessage("Lütfen geçerli bir web sitesi adresi girin.");
      setResult(null);
      return;
    }

    setErrorMessage("");
    setResult(null);
    setPendingResult(null);
    setLeadName("");
    setLeadPhone("");
    setLeadErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalizedUrl }),
      });

      const data = (await response.json()) as AnalyzeResponse;

      if (!response.ok || !data.success || !data.parsed || !data.analysis) {
        throw new Error(data.error ?? "analysis_failed");
      }

      const analysis = parseAnalysisText(data.analysis);

      setPendingResult({
        score: analysis.score,
        url: normalizedUrl,
        checks: buildChecks(data.parsed),
        evaluation: analysis.evaluation,
        problems: analysis.problems,
        suggestions: analysis.suggestions,
      });
    } catch {
      setErrorMessage("Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmittingLead || !pendingResult) return;

    const trimmedName = leadName.trim();
    const trimmedPhone = leadPhone.trim();

    if (!trimmedName || !trimmedPhone) {
      setLeadErrorMessage("Lütfen ad soyad ve telefon numaranızı girin.");
      return;
    }

    setLeadErrorMessage("");
    setIsSubmittingLead(true);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          phone: trimmedPhone,
          url: pendingResult.url,
        }),
      });
    } catch (error) {
      console.error("[ucretsiz-web-site-analizi] lead submission failed", error);
    } finally {
      setIsSubmittingLead(false);
      setResult(pendingResult);
      setPendingResult(null);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07101f] text-white">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[url('/brand/defora-abstract-bg.svg')] bg-cover bg-[56%_46%] opacity-40 saturate-[0.68] contrast-[1.08]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(105deg,rgba(3,8,18,0.92)_0%,rgba(7,16,31,0.82)_42%,rgba(6,10,18,0.92)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_16%_18%,rgba(0,233,255,0.12),transparent_28%),radial-gradient(circle_at_84%_12%,rgba(177,87,253,0.13),transparent_31%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-white/8" />

      <div className="relative z-10">
        <header className="flex flex-col items-center gap-5 px-6 py-14 text-center md:px-10 md:py-20">
          <Link
            href="/"
            aria-label="Defora anasayfa"
            className="group inline-flex h-12 items-center justify-center rounded-full border border-white/12 bg-[#0D172B]/34 px-5 backdrop-blur-md transition duration-500 ease-out hover:border-white/20 hover:bg-white/[0.06] md:h-14 md:px-6"
          >
            <Image
              src="/brand/defora-navbar-logo.svg"
              alt="Defora logo"
              width={2000}
              height={2000}
              priority
              className="h-8 w-auto object-contain transition duration-500 group-hover:scale-[1.01] md:h-[2.5rem]"
            />
          </Link>
          <p className="text-[0.76rem] font-medium uppercase tracking-[0.28em] text-white/42 md:text-[0.8rem]">
            SAYFA · SEO · MOBİL UYUM · HIZ
          </p>
          <h1 className="max-w-[22ch] text-[clamp(2rem,5vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.04em] text-white">
            Ücretsiz Web Sitesi Analizi
          </h1>
          <p className="max-w-[34rem] text-[1rem] leading-[1.75] text-white/64 md:text-[1.06rem]">
            Sitenizin adresini girin, yapay zeka birkaç saniyede teknik ve içerik durumunu değerlendirsin.
          </p>
        </header>

        <section className="mx-auto max-w-[40rem] px-4 pb-14 md:px-0">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(15,24,43,0.92),rgba(10,17,32,0.82))] p-5 shadow-[0_18px_56px_rgba(0,0,0,0.22)] backdrop-blur-[18px] md:p-7">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,233,255,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(177,87,253,0.1),transparent_32%)] opacity-80" />
            <div className="pointer-events-none absolute inset-[1px] rounded-[calc(2rem-1px)] border border-white/[0.05]" />

            <form
              onSubmit={handleSubmit}
              className="relative flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="text"
                value={urlInput}
                onChange={(event) => setUrlInput(event.currentTarget.value)}
                placeholder="ornek-site.com"
                className="h-13 flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-white/28 transition duration-200 focus:border-white/20 focus:bg-white/[0.05]"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-13 items-center justify-center rounded-full bg-[#00e9ff] px-6 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-[#0d172b] transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#33efff] disabled:translate-y-0 disabled:bg-white/20 disabled:text-white/50"
              >
                {isLoading ? "Analiz Ediliyor" : "Analiz Et"}
              </button>
            </form>

            {errorMessage ? (
              <p className="relative mt-4 text-sm leading-[1.6] text-[#ef4444]">{errorMessage}</p>
            ) : null}

            {isLoading ? (
              <div className="relative mt-8 flex flex-col items-center gap-4 py-6">
                <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-[#00e9ff]" />
                <p className="text-[0.98rem] text-white/64">{loadingMessages[loadingMessageIndex]}</p>
              </div>
            ) : null}
          </div>
        </section>

        {pendingResult ? (
          <section className="mx-auto max-w-[40rem] px-4 pb-14 md:px-0">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(15,24,43,0.92),rgba(10,17,32,0.82))] p-5 shadow-[0_18px_56px_rgba(0,0,0,0.22)] backdrop-blur-[18px] md:p-7">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,233,255,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(177,87,253,0.1),transparent_32%)] opacity-80" />
              <div className="pointer-events-none absolute inset-[1px] rounded-[calc(2rem-1px)] border border-white/[0.05]" />

              <div className="relative">
                <h2 className="text-[1.3rem] font-medium tracking-[-0.03em] text-white">
                  Analiz hazır — sonucu görmek için birkaç bilgi
                </h2>
                <p className="mt-2 text-[0.94rem] leading-[1.7] text-white/60">
                  Raporu size özel değerlendirebilmemiz için ad soyad ve telefon numaranızı bırakın.
                </p>

                <form onSubmit={handleLeadSubmit} className="mt-6 grid gap-3">
                  <input
                    type="text"
                    value={leadName}
                    onChange={(event) => setLeadName(event.currentTarget.value)}
                    placeholder="Ad Soyad"
                    className="h-13 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-white/28 transition duration-200 focus:border-white/20 focus:bg-white/[0.05]"
                  />
                  <input
                    type="tel"
                    value={leadPhone}
                    onChange={(event) => setLeadPhone(event.currentTarget.value)}
                    placeholder="Telefon numaranız"
                    className="h-13 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-white/28 transition duration-200 focus:border-white/20 focus:bg-white/[0.05]"
                  />

                  {leadErrorMessage ? (
                    <p className="text-sm leading-[1.6] text-[#ef4444]">{leadErrorMessage}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmittingLead}
                    className="mt-1 inline-flex h-13 items-center justify-center rounded-full bg-[#00e9ff] px-6 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-[#0d172b] transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#33efff] disabled:translate-y-0 disabled:bg-white/20 disabled:text-white/50"
                  >
                    {isSubmittingLead ? "Gönderiliyor" : "Sonucu Göster"}
                  </button>
                </form>
              </div>
            </div>
          </section>
        ) : null}

        {result ? (
          <AnalysisResult
            score={result.score}
            url={result.url}
            checks={result.checks}
            evaluation={result.evaluation}
            problems={result.problems}
            suggestions={result.suggestions}
          />
        ) : null}
      </div>
    </main>
  );
}
