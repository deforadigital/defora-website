"use client";

import { useEffect, useState } from "react";
import { openBooking } from "@/lib/cal";

interface Check {
  name: string;
  value: string;
  status: "ok" | "warn" | "fail";
}

interface AnalysisResultProps {
  score: number;
  url: string;
  checks: Check[];
  evaluation: string;
  problems: string[];
  suggestions: string[];
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

const checkBorderColor: Record<Check["status"], string> = {
  ok: "#22c55e",
  warn: "#f59e0b",
  fail: "#ef4444",
};

const SCORE_RING_SIZE = 160;
const SCORE_RING_STROKE = 12;
const SCORE_RING_RADIUS = (SCORE_RING_SIZE - SCORE_RING_STROKE) / 2;
const SCORE_RING_CIRCUMFERENCE = 2 * Math.PI * SCORE_RING_RADIUS;

function ScoreRing({ score }: { score: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const scoreColor = getScoreColor(score);
  const clampedScore = Math.min(100, Math.max(0, score));

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimatedScore(clampedScore));
    return () => cancelAnimationFrame(frame);
  }, [clampedScore]);

  const dashOffset =
    SCORE_RING_CIRCUMFERENCE - (animatedScore / 100) * SCORE_RING_CIRCUMFERENCE;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative"
        style={{ width: SCORE_RING_SIZE, height: SCORE_RING_SIZE }}
      >
        <svg
          width={SCORE_RING_SIZE}
          height={SCORE_RING_SIZE}
          viewBox={`0 0 ${SCORE_RING_SIZE} ${SCORE_RING_SIZE}`}
          className="-rotate-90"
        >
          <circle
            cx={SCORE_RING_SIZE / 2}
            cy={SCORE_RING_SIZE / 2}
            r={SCORE_RING_RADIUS}
            fill="none"
            stroke="#2a3548"
            strokeWidth={SCORE_RING_STROKE}
          />
          <circle
            cx={SCORE_RING_SIZE / 2}
            cy={SCORE_RING_SIZE / 2}
            r={SCORE_RING_RADIUS}
            fill="none"
            stroke={scoreColor}
            strokeWidth={SCORE_RING_STROKE}
            strokeLinecap="round"
            strokeDasharray={SCORE_RING_CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-[2.6rem] font-medium leading-none tracking-[-0.03em]"
            style={{ color: scoreColor }}
          >
            {score}
          </span>
          <span className="mt-1 text-[0.86rem] text-white/40">/ 100</span>
        </div>
      </div>
      <span className="text-[0.94rem] font-medium" style={{ color: scoreColor }}>
        {getScoreStatusLabel(score)}
      </span>
    </div>
  );
}

function CheckIcon({ status }: { status: Check["status"] }) {
  if (status === "ok") {
    return (
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#22c55e]/30 bg-[#22c55e]/12 text-[#22c55e]">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5 10 17l9-9" />
        </svg>
      </span>
    );
  }

  if (status === "warn") {
    return (
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#f59e0b]/30 bg-[#f59e0b]/12 text-[#f59e0b]">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 8v5" />
          <path d="M12 16.2h.01" />
        </svg>
      </span>
    );
  }

  return (
    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#ef4444]/30 bg-[#ef4444]/12 text-[#ef4444]">
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 6l12 12M18 6 6 18" />
      </svg>
    </span>
  );
}

export default function AnalysisResult({
  score,
  url,
  checks,
  evaluation,
  problems,
  suggestions,
}: AnalysisResultProps) {
  return (
    <div className="mx-auto grid max-w-[64rem] gap-6 px-4 py-10 text-white md:px-0">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(13,23,43,0.92),rgba(9,15,28,0.86))] p-7 shadow-[0_18px_56px_rgba(0,0,0,0.22)] md:p-9">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,233,255,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(177,87,253,0.12),transparent_32%)]" />
        <div className="relative flex flex-col items-center gap-6">
          <p className="truncate text-[0.78rem] font-medium uppercase tracking-[0.2em] text-white/42">
            {url}
          </p>
          <ScoreRing score={score} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {checks.map((check) => (
          <div
            key={check.name}
            className="flex items-start gap-3.5 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5"
            style={{ borderLeft: `4px solid ${checkBorderColor[check.status]}` }}
          >
            <CheckIcon status={check.status} />
            <div className="grid gap-1">
              <span className="text-[0.92rem] font-medium text-white/86">{check.name}</span>
              <span className="text-[0.86rem] leading-[1.5] text-white/56">{check.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 rounded-[2rem] border border-white/12 bg-white/[0.03] p-7 md:p-8">
        <h3 className="text-[1.3rem] font-medium tracking-[-0.03em] text-white">
          Yapay Zeka Değerlendirmesi
        </h3>

        <div className="grid gap-2">
          <span className="text-[0.78rem] font-medium uppercase tracking-[0.18em] text-[#00e9ff]">
            Genel
          </span>
          <p className="text-[0.98rem] leading-[1.75] text-white/72">{evaluation}</p>
        </div>

        <div className="grid gap-2">
          <span className="text-[0.78rem] font-medium uppercase tracking-[0.18em] text-[#ef4444]">
            Sorunlar
          </span>
          <ul className="grid gap-1.5">
            {problems.map((problem, index) => (
              <li
                key={index}
                className="flex items-start gap-2.5 text-[0.94rem] leading-[1.6] text-white/72"
              >
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ef4444]" />
                {problem}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-2">
          <span className="text-[0.78rem] font-medium uppercase tracking-[0.18em] text-[#b157fd]">
            Öneriler
          </span>
          <ul className="grid gap-1.5">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex items-start gap-2.5 text-[0.94rem] leading-[1.6] text-white/72"
              >
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b157fd]" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(13,23,43,0.95),rgba(9,15,28,0.9))] p-7 md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,233,255,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(177,87,253,0.1),transparent_32%)]" />
        <div className="relative grid gap-4">
          <h3 className="text-[1.2rem] font-medium tracking-[-0.03em] text-white">
            Sitenizi hemen iyileştirmek için bir görüşme yapalım
          </h3>
          <p className="text-[0.94rem] leading-[1.7] text-white/60">
            Bilgileriniz alındı. Analiz sonucunu birlikte değerlendirmek için ücretsiz bir strateji görüşmesi planlayın.
          </p>
          <button
            type="button"
            onClick={() => void openBooking("tr")}
            className="inline-flex h-13 w-fit items-center justify-center rounded-full bg-[#00e9ff] px-6 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-[#0d172b] transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#33efff]"
          >
            Görüşme Planla
          </button>
        </div>
      </div>
    </div>
  );
}
