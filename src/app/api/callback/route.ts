import { NextResponse } from "next/server";
import Netgsm from "@netgsm/sms";

const TARGET_PHONE = "5400333672";

const netgsmUserCode = process.env.NETGSM_USERCODE;
const netgsmPassword = process.env.NETGSM_PASSWORD;
const netgsmHeader = process.env.NETGSM_HEADER;

interface CallbackPayload {
  ad?: string;
  soyad?: string;
  sektor?: string;
  telefon?: string;
}

function cleanValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  // Accept 5XXXXXXXXX (10) or 05XXXXXXXXX (11) or 905XXXXXXXXX (12)
  const withoutCountryCode = digits.startsWith("90") && digits.length === 12
    ? digits.slice(2)
    : digits;
  const withoutLeadingZero = withoutCountryCode.startsWith("0")
    ? withoutCountryCode.slice(1)
    : withoutCountryCode;

  if (/^5\d{9}$/.test(withoutLeadingZero)) {
    return withoutLeadingZero;
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CallbackPayload;
    const ad = cleanValue(body.ad);
    const soyad = cleanValue(body.soyad);
    const sektor = cleanValue(body.sektor);
    const telefonRaw = cleanValue(body.telefon);

    if (!ad || !soyad || !telefonRaw) {
      return NextResponse.json(
        { success: false, error: "invalid_payload" },
        { status: 400 },
      );
    }

    if (ad.length > 60 || soyad.length > 60 || sektor.length > 60) {
      return NextResponse.json(
        { success: false, error: "invalid_payload" },
        { status: 400 },
      );
    }

    const telefon = normalizePhone(telefonRaw);
    if (!telefon) {
      return NextResponse.json(
        { success: false, error: "invalid_phone" },
        { status: 400 },
      );
    }

    if (!netgsmUserCode || !netgsmPassword || !netgsmHeader) {
      console.error("[callback] Netgsm env vars missing", {
        hasUserCode: Boolean(netgsmUserCode),
        hasPassword: Boolean(netgsmPassword),
        hasHeader: Boolean(netgsmHeader),
      });
      return NextResponse.json(
        { success: false, error: "sms_unavailable" },
        { status: 500 },
      );
    }

    const netgsm = new Netgsm({
      username: netgsmUserCode,
      password: netgsmPassword,
      appname: "defora-teklif-callback",
    });

    const messageText = [
      "Yeni geri arama talebi (/teklif)",
      `Ad Soyad: ${ad} ${soyad}`,
      sektor ? `Sektor: ${sektor}` : null,
      `Tel: 0${telefon}`,
    ]
      .filter(Boolean)
      .join(" | ")
      .slice(0, 480);

    const response = await netgsm.sendRestSms({
      msgheader: netgsmHeader,
      encoding: "TR",
      messages: [{ msg: messageText, no: TARGET_PHONE }],
    });

    if (response.code !== "00") {
      console.error("[callback] Netgsm rejected request", response);
      return NextResponse.json(
        { success: false, error: "sms_delivery_failed" },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[callback] submission failed", error);
    return NextResponse.json(
      { success: false, error: "server_error" },
      { status: 500 },
    );
  }
}
