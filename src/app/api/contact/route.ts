import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom =
  process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const resendTo = process.env.RESEND_TO_EMAIL || "deforadigital@gmail.com";
const resend = resendApiKey ? new Resend(resendApiKey) : null;

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
      hasResendApiKey: Boolean(resendApiKey),
      resendFrom,
      resendTo,
    });

    const body = (await request.json()) as ContactPayload;
    const name = cleanValue(body.name);
    const contact = cleanValue(body.contact);
    const message = cleanValue(body.message);
    const website = cleanValue(body.website);
    const locale = cleanValue(body.locale) || "tr";

    console.log("[contact] payload received", {
      hasName: Boolean(name),
      hasContact: Boolean(contact),
      hasMessage: Boolean(message),
      honeypotFilled: Boolean(website),
      locale,
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

    if (!resend) {
      console.error("RESEND_API_KEY is missing");
      return NextResponse.json(
        { success: false, error: "email_unavailable" },
        { status: 500 },
      );
    }

    const submittedAt = new Date().toLocaleString(
      locale === "en" ? "en-US" : "tr-TR",
      {
        dateStyle: "long",
        timeStyle: "short",
      },
    );

    const resendResponse = await resend.emails.send({
      from: resendFrom,
      to: [resendTo],
      replyTo: contact.includes("@") ? contact : undefined,
      subject:
        locale === "en" ? "New contact form submission" : "Yeni iletişim formu talebi",
      text: [
        `Name: ${name || "-"}`,
        `Contact: ${contact}`,
        "",
        "Message:",
        message,
        "",
        `Submitted: ${submittedAt}`,
      ].join("\n"),
    });

    console.log("[contact] resend response", resendResponse);

    if (resendResponse.error) {
      console.error("[contact] resend rejected request", resendResponse.error);
      return NextResponse.json(
        { success: false, error: "email_delivery_failed" },
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
