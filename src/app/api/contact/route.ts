import { NextResponse } from "next/server";
import Netgsm from "@netgsm/sms";

const TARGET_PHONE = "5400333672";

const netgsmUserCode = process.env.NETGSM_USERCODE;
const netgsmPassword = process.env.NETGSM_PASSWORD;
const netgsmHeader = process.env.NETGSM_HEADER;

type ContactPayload = {
  name?: string;
  contact?: string;
  message?: string;
  website?: string;
  locale?: string;
};

function cleanValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    console.log("[contact] API route hit");
    console.log("[contact] env presence", {
      hasNetgsmUserCode: Boolean(netgsmUserCode),
      hasNetgsmPassword: Boolean(netgsmPassword),
      hasNetgsmHeader: Boolean(netgsmHeader),
    });

    const body = (await request.json()) as ContactPayload;
    const name = cleanValue(body.name);
    const contact = cleanValue(body.contact);
    const message = cleanValue(body.message);
    const website = cleanValue(body.website);

    console.log("[contact] payload received", {
      hasName: Boolean(name),
      hasContact: Boolean(contact),
      hasMessage: Boolean(message),
      honeypotFilled: Boolean(website),
    });

    if (website) {
      console.warn("[contact] honeypot triggered");
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (!contact || !message) {
      console.warn("[contact] validation failed", {
        hasContact: Boolean(contact),
        hasMessage: Boolean(message),
      });
      return NextResponse.json(
        { success: false, error: "invalid_payload" },
        { status: 400 },
      );
    }

    if (!netgsmUserCode || !netgsmPassword || !netgsmHeader) {
      console.error("[contact] Netgsm env vars missing", {
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
      appname: "defora-website-contact",
    });

    const messageText = [
      "Yeni iletişim formu talebi",
      `Ad: ${name || "-"}`,
      `İletişim: ${contact}`,
      `Mesaj: ${message}`,
    ]
      .join(" | ")
      .slice(0, 480);

    const response = await netgsm.sendRestSms({
      msgheader: netgsmHeader,
      encoding: "TR",
      messages: [{ msg: messageText, no: TARGET_PHONE }],
    });

    if (response.code !== "00") {
      console.error("[contact] Netgsm rejected request", response);
      return NextResponse.json(
        { success: false, error: "sms_delivery_failed" },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact form submission failed", error);
    return NextResponse.json(
      { success: false, error: "server_error" },
      { status: 500 },
    );
  }
}
