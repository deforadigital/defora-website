import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

const deepseekApiKey = process.env.DEEPSEEK_API_KEY;

interface AnalyzePayload {
  url?: string;
}

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

function cleanValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function parseHtml(html: string): ParsedPage {
  const $ = cheerio.load(html);

  const title = $("title").first().text().trim();
  const description = $('meta[name="description"]').attr("content")?.trim() ?? "";
  const h1List = $("h1")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean);
  const h2Count = $("h2").length;
  const hasViewport = $('meta[name="viewport"]').length > 0;
  const hasOgTitle = $('meta[property="og:title"]').length > 0;
  const hasCanonical = $('link[rel="canonical"]').length > 0;

  const images = $("img");
  const imageCount = images.length;
  const imagesMissingAlt = images
    .filter((_, el) => !$(el).attr("alt")?.trim())
    .length;

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText ? bodyText.split(" ").length : 0;

  return {
    title,
    description,
    h1List,
    h2Count,
    hasViewport,
    hasOgTitle,
    hasCanonical,
    imageCount,
    imagesMissingAlt,
    wordCount,
  };
}

function buildPrompt(url: string, parsed: ParsedPage): string {
  return `Bir web sitesini işletme sahibi için değerlendiriyorsun. Hiçbir teknik terim kullanma. SEO, H1, H2, meta, canonical, keyword gibi kelimeler yasak. Sanki bir esnafa anlatır gibi yaz.

Site: ${url}

Sayfa Başlığı: ${parsed.title || "(yok)"}
Açıklama Metni: ${parsed.description || "(yok)"}
Ana Başlıklar: ${parsed.h1List.length ? parsed.h1List.join(", ") : "(yok)"}
Alt Başlık Sayısı: ${parsed.h2Count}
Mobil Uyumluluk: ${parsed.hasViewport ? "var" : "yok"}
Sosyal Medya Paylaşım Görünümü: ${parsed.hasOgTitle ? "var" : "yok"}
Kopya İçerik Koruması: ${parsed.hasCanonical ? "var" : "yok"}
Toplam Görsel Sayısı: ${parsed.imageCount}
Açıklaması Eksik Görsel Sayısı: ${parsed.imagesMissingAlt}
Sayfa Metninde Kelime Sayısı: ${parsed.wordCount}

Bu bilgilere göre siteyi değerlendir ve tam olarak şu formatta yanıt ver:

PUAN: [0-100]
DEĞERLENDİRME: [3-4 cümle]
SORUNLAR:
- ...
- ...
- ...
ÖNERİLER:
- ...
- ...
- ...`;
}

const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

async function fetchDirect(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { "User-Agent": BROWSER_USER_AGENT },
  });

  console.log("[analyze] direct fetch status", response.status, response.statusText);

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    throw new Error(`direct_fetch_failed_${response.status}: ${bodyText}`);
  }

  const html = await response.text();
  console.log("[analyze] direct fetch contents length", html.length);

  if (!html) {
    throw new Error("direct_fetch_empty_contents");
  }

  return html;
}

async function fetchViaCorsproxy(url: string): Promise<string> {
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
  const response = await fetch(proxyUrl, {
    headers: { "User-Agent": BROWSER_USER_AGENT },
  });

  console.log("[analyze] corsproxy fetch status", response.status, response.statusText);

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    throw new Error(`corsproxy_fetch_failed_${response.status}: ${bodyText}`);
  }

  const html = await response.text();
  console.log("[analyze] corsproxy fetch contents length", html.length);

  if (!html) {
    throw new Error("corsproxy_fetch_empty_contents");
  }

  return html;
}

async function fetchViaJinaReader(url: string): Promise<string> {
  const readerUrl = `https://r.jina.ai/${url}`;
  const response = await fetch(readerUrl, {
    headers: { "User-Agent": BROWSER_USER_AGENT },
  });

  console.log("[analyze] jina reader fetch status", response.status, response.statusText);

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    throw new Error(`jina_reader_fetch_failed_${response.status}: ${bodyText}`);
  }

  const html = await response.text();
  console.log("[analyze] jina reader fetch contents length", html.length);

  if (!html) {
    throw new Error("jina_reader_fetch_empty_contents");
  }

  return html;
}

async function fetchPageHtml(url: string): Promise<string> {
  const strategies: { name: string; run: (targetUrl: string) => Promise<string> }[] = [
    { name: "direct", run: fetchDirect },
    { name: "corsproxy", run: fetchViaCorsproxy },
    { name: "jina_reader", run: fetchViaJinaReader },
  ];

  const failures: string[] = [];

  for (const strategy of strategies) {
    try {
      return await strategy.run(url);
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`[analyze] ${strategy.name} strategy failed`, message);
      failures.push(`${strategy.name}: ${message}`);
    }
  }

  throw new Error(`all_fetch_strategies_failed: ${failures.join(" | ")}`);
}

async function callDeepseek(prompt: string): Promise<string> {
  if (!deepseekApiKey) {
    throw new Error("deepseek_api_key_missing");
  }

  const requestBody = {
    model: "deepseek-chat",
    messages: [{ role: "user", content: prompt }],
  };

  console.log("[analyze] deepseek request body", requestBody);

  let response: Response;
  try {
    response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${deepseekApiKey}`,
      },
      body: JSON.stringify(requestBody),
    });
  } catch (error) {
    console.error("[analyze] deepseek fetch threw", error);
    throw new Error(`deepseek_fetch_error: ${getErrorMessage(error)}`);
  }

  console.log("[analyze] deepseek response status", response.status, response.statusText);

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    console.error("[analyze] deepseek response not ok", response.status, bodyText);
    throw new Error(`deepseek_request_failed_${response.status}: ${bodyText}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  console.log("[analyze] deepseek response body", data);

  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("deepseek_empty_response");
  }

  return content;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzePayload;
    const url = cleanValue(body.url);

    if (!url) {
      return NextResponse.json(
        { success: false, error: "invalid_payload" },
        { status: 400 },
      );
    }

    const html = await fetchPageHtml(url);
    const parsed = parseHtml(html);
    const prompt = buildPrompt(url, parsed);
    const analysis = await callDeepseek(prompt);

    return NextResponse.json(
      { success: true, parsed, analysis },
      { status: 200 },
    );
  } catch (error) {
    console.error("Site analysis failed", error);
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
