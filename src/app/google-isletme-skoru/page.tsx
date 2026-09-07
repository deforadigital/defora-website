"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface Check {
  name: string;
  passed: boolean;
  points: number;
  description: string;
}

interface PlaceCandidate {
  placeId: string;
  name: string;
  address: string;
}

interface Suggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
}

interface AutocompleteResponse {
  success: boolean;
  suggestions?: Suggestion[];
  error?: string;
}

interface GbpScoreResponse {
  success: boolean;
  name?: string;
  rating?: number | null;
  userRatingsTotal?: number;
  score?: number;
  checks?: Check[];
  error?: string;
}

interface ScoreData {
  name: string;
  rating: number | null;
  userRatingsTotal: number;
  score: number;
  checks: Check[];
}

const scoreLoadingMessages = [
  "Profil bilgileri toplanıyor...",
  "Skor hesaplanıyor...",
  "Rapor hazırlanıyor...",
];

const AUTOCOMPLETE_DEBOUNCE_MS = 300;

function normalizePhone(input: string): string | null {
  const digitsOnly = input.replace(/\D/g, "");
  const withoutCountryCode = digitsOnly.startsWith("90")
    ? digitsOnly.slice(2)
    : digitsOnly;
  const local = withoutCountryCode.startsWith("0")
    ? withoutCountryCode.slice(1)
    : withoutCountryCode;

  if (!/^5\d{9}$/.test(local)) return null;

  return local;
}

function getScoreColor(score: number): string {
  if (score >= 70) return "#22c55e";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

function getScoreStatusLabel(score: number): string {
  if (score >= 70) return "İyi";
  if (score >= 40) return "Geliştirilmeli";
  return "Acil Müdahale Gerekiyor";
}

export default function GoogleIsletmeSkoruPage() {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [showNotFoundLead, setShowNotFoundLead] = useState(false);
  const [notFoundBusinessName, setNotFoundBusinessName] = useState("");
  const [notFoundCity, setNotFoundCity] = useState("");
  const [notFoundPhone, setNotFoundPhone] = useState("");
  const [notFoundKvkkConsent, setNotFoundKvkkConsent] = useState(false);
  const [notFoundErrorMessage, setNotFoundErrorMessage] = useState("");
  const [isSubmittingNotFoundLead, setIsSubmittingNotFoundLead] = useState(false);
  const [notFoundLeadSubmitted, setNotFoundLeadSubmitted] = useState(false);
  const [pendingResult, setPendingResult] = useState<ScoreData | null>(null);
  const [result, setResult] = useState<ScoreData | null>(null);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadErrorMessage, setLeadErrorMessage] = useState("");
  const [kvkkConsent, setKvkkConsent] = useState(false);
  const [dropdownAlignment, setDropdownAlignment] = useState<"below" | "above">("below");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const DROPDOWN_ESTIMATED_HEIGHT = 340;

  const updateDropdownAlignment = () => {
    const input = searchInputRef.current;
    if (!input) return;

    const spaceBelow = window.innerHeight - input.getBoundingClientRect().bottom;
    setDropdownAlignment(spaceBelow < DROPDOWN_ESTIMATED_HEIGHT ? "above" : "below");
  };

  useEffect(() => {
    if (!isLoading) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    setLoadingMessageIndex(0);
    intervalRef.current = setInterval(() => {
      setLoadingMessageIndex((current) => (current + 1) % scoreLoadingMessages.length);
    }, 1800);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLoading]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const fetchSuggestions = async (value: string) => {
    setIsFetchingSuggestions(true);

    try {
      const response = await fetch("/api/places-autocomplete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: value }),
      });

      const data = (await response.json()) as AutocompleteResponse;

      setSuggestions(response.ok && data.success ? (data.suggestions ?? []) : []);
    } catch {
      setSuggestions([]);
    } finally {
      setIsFetchingSuggestions(false);
    }
  };

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    setShowSuggestions(true);
    setErrorMessage("");
    updateDropdownAlignment();

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = value.trim();

    if (trimmed.length < 2) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      void fetchSuggestions(trimmed);
    }, AUTOCOMPLETE_DEBOUNCE_MS);
  };

  const handleSelectCandidate = async (candidate: PlaceCandidate) => {
    if (isLoading) return;

    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gbp-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId: candidate.placeId }),
      });

      const data = (await response.json()) as GbpScoreResponse;

      if (!response.ok || !data.success || data.score === undefined || !data.checks) {
        throw new Error(data.error ?? "score_failed");
      }

      setPendingResult({
        name: data.name ?? candidate.name,
        rating: data.rating ?? null,
        userRatingsTotal: data.userRatingsTotal ?? 0,
        score: data.score,
        checks: data.checks,
      });
    } catch {
      setErrorMessage("Skor hesaplanırken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setShowSuggestions(false);
    setSuggestions([]);
    setSearchInput(suggestion.mainText);
    setResult(null);
    setShowNotFoundLead(false);
    setNotFoundBusinessName("");
    setNotFoundCity("");
    setNotFoundPhone("");
    setNotFoundKvkkConsent(false);
    setNotFoundErrorMessage("");
    setNotFoundLeadSubmitted(false);
    setLeadName("");
    setLeadPhone("");
    setLeadErrorMessage("");
    setKvkkConsent(false);

    void handleSelectCandidate({
      placeId: suggestion.placeId,
      name: suggestion.mainText,
      address: suggestion.secondaryText,
    });
  };

  const handleNotFoundLeadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmittingNotFoundLead) return;

    const trimmedName = notFoundBusinessName.trim();
    const trimmedCity = notFoundCity.trim();
    const normalizedPhone = normalizePhone(notFoundPhone);

    if (!trimmedName || !trimmedCity || !notFoundPhone.trim()) {
      setNotFoundErrorMessage("Lütfen işletme adı, şehir ve telefon numaranızı girin.");
      return;
    }

    if (!normalizedPhone) {
      setNotFoundErrorMessage("Lütfen geçerli bir cep telefonu numarası girin (örn. 05XX XXX XX XX).");
      return;
    }

    if (!notFoundKvkkConsent) {
      setNotFoundErrorMessage("Devam etmek için KVKK Aydınlatma Metni'ni onaylamanız gerekiyor.");
      return;
    }

    setNotFoundErrorMessage("");
    setIsSubmittingNotFoundLead(true);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          phone: normalizedPhone,
          company: trimmedName,
          city: trimmedCity,
        }),
      });
    } catch (error) {
      console.error("[google-isletme-skoru] not-found lead submission failed", error);
    } finally {
      setIsSubmittingNotFoundLead(false);
      setNotFoundLeadSubmitted(true);
    }
  };

  const handleLeadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmittingLead || !pendingResult) return;

    const trimmedName = leadName.trim();
    const normalizedPhone = normalizePhone(leadPhone);

    if (!trimmedName || !leadPhone.trim()) {
      setLeadErrorMessage("Lütfen ad soyad ve telefon numaranızı girin.");
      return;
    }

    if (!normalizedPhone) {
      setLeadErrorMessage("Lütfen geçerli bir cep telefonu numarası girin (örn. 05XX XXX XX XX).");
      return;
    }

    if (!kvkkConsent) {
      setLeadErrorMessage("Devam etmek için KVKK Aydınlatma Metni'ni onaylamanız gerekiyor.");
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
          phone: normalizedPhone,
          company: pendingResult.name,
        }),
      });
    } catch (error) {
      console.error("[google-isletme-skoru] lead submission failed", error);
    } finally {
      setIsSubmittingLead(false);
      setResult(pendingResult);
      setPendingResult(null);
    }
  };

  const scoreColor = result ? getScoreColor(result.score) : "#00e9ff";
  const whatsappMessage = result
    ? `Merhaba, ${result.name} işletmem için Google İşletme Skoru analizinde ${result.score} puan aldım. Görüşmek istiyorum.`
    : "";
  const whatsappHref = `https://wa.me/905400333672?text=${encodeURIComponent(whatsappMessage)}`;

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
            GOOGLE · İŞLETME PROFİLİ · GÖRÜNÜRLÜK
          </p>
          <h1 className="max-w-[24ch] text-[clamp(2rem,5vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.04em] text-white">
            Google İşletme Skoru
          </h1>
          <p className="max-w-[34rem] text-[1rem] leading-[1.75] text-white/64 md:text-[1.06rem]">
            İşletmenizin adını yazmaya başlayın, Google&apos;daki listeden seçin — profilinizin ne kadar güçlü olduğunu birkaç saniyede öğrenin.
          </p>
        </header>

        <section className="mx-auto max-w-[40rem] px-4 pb-14 md:px-0">
          <div className="relative rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(15,24,43,0.92),rgba(10,17,32,0.82))] p-5 shadow-[0_18px_56px_rgba(0,0,0,0.22)] backdrop-blur-[18px] md:p-7">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,rgba(0,233,255,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(177,87,253,0.1),transparent_32%)] opacity-80" />
            <div className="pointer-events-none absolute inset-[1px] rounded-[calc(2rem-1px)] border border-white/[0.05]" />

            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchInput}
                onChange={(event) => handleSearchInputChange(event.currentTarget.value)}
                onFocus={() => {
                  setShowSuggestions(true);
                  updateDropdownAlignment();
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="İşletme adınızı yazın..."
                disabled={isLoading}
                className="h-20 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-xl text-white outline-none placeholder:text-white/28 transition duration-200 focus:border-white/20 focus:bg-white/[0.05] disabled:opacity-50"
              />

              {showSuggestions && searchInput.trim().length >= 2 ? (
                <div
                  style={{
                    transformOrigin: dropdownAlignment === "below" ? "top" : "bottom",
                    animation: "suggestion-dropdown-in 0.18s ease-out",
                  }}
                  className={`absolute inset-x-0 z-20 overflow-hidden rounded-2xl border border-white/12 bg-[linear-gradient(180deg,rgba(20,31,54,0.98),rgba(13,23,43,0.98))] shadow-[0_24px_56px_rgba(0,0,0,0.5)] backdrop-blur-xl ${
                    dropdownAlignment === "below"
                      ? "top-[calc(100%+0.625rem)]"
                      : "bottom-[calc(100%+0.625rem)]"
                  }`}
                >
                  <div className="max-h-[min(21rem,45vh)] overflow-y-auto">
                    {isFetchingSuggestions ? (
                      <p className="px-5 py-5 text-[0.9rem] text-white/50">Aranıyor...</p>
                    ) : suggestions.length ? (
                      suggestions.map((suggestion) => (
                        <button
                          key={suggestion.placeId}
                          type="button"
                          onMouseDown={() => handleSelectSuggestion(suggestion)}
                          className="group flex w-full items-start gap-3.5 border-b border-white/[0.06] px-5 py-4 text-left transition duration-150 hover:bg-white/[0.07]"
                        >
                          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-white/40 transition duration-150 group-hover:bg-[#00e9ff]/12 group-hover:text-[#00e9ff]">
                            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 10.5c0 5.5-8 11.5-8 11.5s-8-6-8-11.5a8 8 0 1 1 16 0Z" />
                              <circle cx="12" cy="10.5" r="2.6" />
                            </svg>
                          </span>
                          <span className="grid gap-0.5">
                            <span className="text-[0.94rem] font-medium text-white">{suggestion.mainText}</span>
                            {suggestion.secondaryText ? (
                              <span className="text-[0.8rem] text-white/50">{suggestion.secondaryText}</span>
                            ) : null}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="px-5 py-5 text-[0.9rem] text-white/50">Eşleşme bulunamadı.</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onMouseDown={() => {
                      setShowSuggestions(false);
                      setShowNotFoundLead(true);
                      setNotFoundBusinessName(searchInput.trim());
                    }}
                    className="w-full border-t border-white/10 bg-white/[0.02] px-5 py-4 text-left text-[0.88rem] font-medium text-white/60 transition duration-150 hover:bg-white/[0.07] hover:text-white"
                  >
                    İşletmemi bulamadım
                  </button>
                </div>
              ) : null}
            </div>

            {errorMessage ? (
              <p className="relative mt-4 text-sm leading-[1.6] text-[#ef4444]">{errorMessage}</p>
            ) : null}

            {showNotFoundLead ? (
              notFoundLeadSubmitted ? (
                <div className="relative mt-5 rounded-2xl border border-[#22c55e]/20 bg-[#22c55e]/[0.06] px-5 py-4">
                  <p className="text-[0.94rem] leading-[1.6] text-white/86">
                    Teşekkürler! İşletmenizi bulamadık ama ekibimiz sizi arayıp ücretsiz analiz yapacak.
                  </p>
                </div>
              ) : (
                <div className="relative mt-5">
                  <p className="text-[0.86rem] leading-[1.6] text-white/60">
                    Sorun değil — işletme adı, şehir ve telefon numaranızı bırakın, ekibimiz sizi arayıp işletmenizi birlikte inceleyelim.
                  </p>

                  <form onSubmit={handleNotFoundLeadSubmit} className="mt-4 grid gap-3">
                    <input
                      type="text"
                      value={notFoundBusinessName}
                      onChange={(event) => setNotFoundBusinessName(event.currentTarget.value)}
                      placeholder="İşletme Adı"
                      className="h-16 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-base text-white outline-none placeholder:text-white/28 transition duration-200 focus:border-white/20 focus:bg-white/[0.05]"
                    />
                    <input
                      type="text"
                      value={notFoundCity}
                      onChange={(event) => setNotFoundCity(event.currentTarget.value)}
                      placeholder="Şehir"
                      className="h-16 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-base text-white outline-none placeholder:text-white/28 transition duration-200 focus:border-white/20 focus:bg-white/[0.05]"
                    />
                    <input
                      type="tel"
                      value={notFoundPhone}
                      onChange={(event) => setNotFoundPhone(event.currentTarget.value)}
                      placeholder="Telefon numaranız"
                      className="h-16 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-base text-white outline-none placeholder:text-white/28 transition duration-200 focus:border-white/20 focus:bg-white/[0.05]"
                    />

                    <label className="flex items-start gap-3 text-[0.85rem] leading-[1.6] text-white/64">
                      <input
                        type="checkbox"
                        checked={notFoundKvkkConsent}
                        onChange={(event) => setNotFoundKvkkConsent(event.currentTarget.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/[0.04] accent-[#00e9ff]"
                      />
                      <span>
                        <Link
                          href="/kvkk-aydinlatma-metni"
                          target="_blank"
                          className="font-medium text-[#00e9ff] underline underline-offset-2 hover:text-[#33efff]"
                        >
                          Aydınlatma Metni
                        </Link>
                        &apos;ni okudum, kişisel verilerimin işlenmesini kabul ediyorum.
                      </span>
                    </label>

                    {notFoundErrorMessage ? (
                      <p className="text-sm leading-[1.6] text-[#ef4444]">{notFoundErrorMessage}</p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={isSubmittingNotFoundLead || !notFoundKvkkConsent}
                      className="inline-flex h-14 items-center justify-center rounded-full bg-[#00e9ff] px-8 text-[0.8rem] font-medium uppercase tracking-[0.16em] text-[#0d172b] transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#33efff] disabled:translate-y-0 disabled:bg-white/20 disabled:text-white/50"
                    >
                      {isSubmittingNotFoundLead ? "Gönderiliyor" : "Beni Arayın"}
                    </button>
                  </form>
                </div>
              )
            ) : null}

            {isLoading ? (
              <div className="relative mt-8 flex flex-col items-center gap-4 py-6">
                <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-[#00e9ff]" />
                <p className="text-[0.98rem] text-white/64">{scoreLoadingMessages[loadingMessageIndex]}</p>
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
                  Skor hazır — sonucu görmek için birkaç bilgi
                </h2>
                <p className="mt-2 truncate text-[0.9rem] font-medium text-[#00e9ff]">
                  {pendingResult.name}
                </p>
                <p className="mt-2 text-[0.94rem] leading-[1.7] text-white/60">
                  Raporu size özel değerlendirebilmemiz için ad soyad ve telefon numaranızı bırakın.
                </p>

                <form onSubmit={handleLeadSubmit} className="mt-6 grid gap-3">
                  <input
                    type="text"
                    value={leadName}
                    onChange={(event) => setLeadName(event.currentTarget.value)}
                    placeholder="Ad Soyad"
                    className="h-16 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-lg text-white outline-none placeholder:text-white/28 transition duration-200 focus:border-white/20 focus:bg-white/[0.05]"
                  />
                  <input
                    type="tel"
                    value={leadPhone}
                    onChange={(event) => setLeadPhone(event.currentTarget.value)}
                    placeholder="Telefon numaranız"
                    className="h-16 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-lg text-white outline-none placeholder:text-white/28 transition duration-200 focus:border-white/20 focus:bg-white/[0.05]"
                  />

                  <label className="mt-1 flex items-start gap-3 text-[0.85rem] leading-[1.6] text-white/64">
                    <input
                      type="checkbox"
                      checked={kvkkConsent}
                      onChange={(event) => setKvkkConsent(event.currentTarget.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/[0.04] accent-[#00e9ff]"
                    />
                    <span>
                      <Link
                        href="/kvkk-aydinlatma-metni"
                        target="_blank"
                        className="font-medium text-[#00e9ff] underline underline-offset-2 hover:text-[#33efff]"
                      >
                        Aydınlatma Metni
                      </Link>
                      &apos;ni okudum, kişisel verilerimin işlenmesini kabul ediyorum.
                    </span>
                  </label>

                  {leadErrorMessage ? (
                    <p className="text-sm leading-[1.6] text-[#ef4444]">{leadErrorMessage}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmittingLead || !kvkkConsent}
                    className="mt-1 inline-flex h-16 items-center justify-center rounded-full bg-[#00e9ff] px-8 text-[0.84rem] font-medium uppercase tracking-[0.16em] text-[#0d172b] transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#33efff] disabled:translate-y-0 disabled:bg-white/20 disabled:text-white/50"
                  >
                    {isSubmittingLead ? "Gönderiliyor" : "Sonucu Göster"}
                  </button>
                </form>
              </div>
            </div>
          </section>
        ) : null}

        {result ? (
          <section className="mx-auto grid max-w-[64rem] gap-6 px-4 pb-14 md:px-0">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(13,23,43,0.92),rgba(9,15,28,0.86))] p-7 shadow-[0_18px_56px_rgba(0,0,0,0.22)] md:p-9">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,233,255,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(177,87,253,0.12),transparent_32%)]" />
              <div className="relative flex flex-col items-center gap-4 text-center">
                <p className="truncate text-[0.78rem] font-medium uppercase tracking-[0.2em] text-white/42">
                  {result.name}
                </p>
                <div className="flex flex-col items-center gap-2">
                  <span
                    className="text-[3.4rem] font-medium leading-none tracking-[-0.03em]"
                    style={{ color: scoreColor }}
                  >
                    {result.score}
                    <span className="ml-1 text-[1.4rem] text-white/40">/ 100</span>
                  </span>
                  <span className="text-[0.94rem] font-medium" style={{ color: scoreColor }}>
                    {getScoreStatusLabel(result.score)}
                  </span>
                </div>
                {result.rating !== null ? (
                  <p className="text-[0.9rem] text-white/56">
                    Google puanı: {result.rating.toFixed(1)} · {result.userRatingsTotal} yorum
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {result.checks.map((check) => (
                <div
                  key={check.name}
                  className="flex items-start gap-3.5 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5"
                  style={{ borderLeft: `4px solid ${check.passed ? "#22c55e" : "#ef4444"}` }}
                >
                  <span
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[1.1rem]"
                    style={{
                      color: check.passed ? "#22c55e" : "#ef4444",
                      backgroundColor: check.passed ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                    }}
                  >
                    {check.passed ? "✅" : "❌"}
                  </span>
                  <div className="grid gap-1">
                    <span className="text-[0.92rem] font-medium text-white/86">{check.name}</span>
                    <span className="text-[0.86rem] leading-[1.5] text-white/56">{check.description}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(13,23,43,0.95),rgba(9,15,28,0.9))] p-7 md:p-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,233,255,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(177,87,253,0.1),transparent_32%)]" />
              <div className="relative grid gap-4">
                <h3 className="text-[1.2rem] font-medium tracking-[-0.03em] text-white">
                  Google İşletme Profilinizi güçlendirelim
                </h3>
                <p className="text-[0.94rem] leading-[1.7] text-white/60">
                  Bilgileriniz alındı. Profilinizi birlikte değerlendirmek için hemen WhatsApp&apos;tan yazın.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-13 w-fit items-center justify-center gap-2.5 rounded-full bg-[#00e9ff] px-6 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-[#0d172b] transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#33efff]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 11.2A8 8 0 0 1 8.36 18.3L4 20l1.56-4.14A8 8 0 1 1 20 11.2Z" />
                      <path d="M9 10.2c.18 1.18 1.62 2.62 2.8 2.8" />
                      <path d="M14.55 13.95c-.26.73-1.34.92-2.42.4a6.44 6.44 0 0 1-2.48-2.48c-.52-1.08-.33-2.16.4-2.42" />
                    </svg>
                    WhatsApp&apos;tan Yaz
                  </a>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
