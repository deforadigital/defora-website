import { NextResponse, type NextRequest } from "next/server";
import {
  isLocale,
  localeCookieMaxAge,
  localeCookieName,
} from "@/lib/i18n";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    locale?: string;
  } | null;

  if (!isLocale(body?.locale)) {
    return NextResponse.json({ error: "Unsupported locale" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: localeCookieName,
    value: body.locale,
    maxAge: localeCookieMaxAge,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
