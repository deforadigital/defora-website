import { NextResponse } from "next/server";
import Netgsm from "@netgsm/sms";

const netgsmUserCode = process.env.NETGSM_USERCODE;
const netgsmPassword = process.env.NETGSM_PASSWORD;
const netgsmHeader = process.env.NETGSM_HEADER;
const netgsmReceiver = process.env.NETGSM_RECEIVER;

type LeadPayload = {
  name?: string;
  phone?: string;
  company?: string;
  url?: string;
};

function cleanValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function sendLeadSms(lead: Required<LeadPayload>) {
  if (!netgsmUserCode || !netgsmPassword || !netgsmHeader || !netgsmReceiver) {
    console.error("[leads] Netgsm env vars missing", {
      hasUserCode: Boolean(netgsmUserCode),
      hasPassword: Boolean(netgsmPassword),
      hasHeader: Boolean(netgsmHeader),
      hasReceiver: Boolean(netgsmReceiver),
    });
    return;
  }

  try {
    const netgsm = new Netgsm({
      username: netgsmUserCode,
      password: netgsmPassword,
      appname: "defora-website-leads",
    });

    const messageText = [
      "Yeni analiz lead!",
      `Ad: ${lead.name || "-"}`,
      `Tel: ${lead.phone || "-"}`,
      `Firma: ${lead.company || "-"}`,
      `Site: ${lead.url || "-"}`,
    ]
      .join("\n")
      .slice(0, 480);

    const response = await netgsm.sendRestSms({
      msgheader: netgsmHeader,
      encoding: "TR",
      messages: [{ msg: messageText, no: netgsmReceiver }],
    });

    if (response.code !== "00") {
      console.error("[leads] Netgsm rejected request", response);
    }
  } catch (error) {
    console.error("[leads] Netgsm send failed", error);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadPayload;
    const name = cleanValue(body.name);
    const phone = cleanValue(body.phone);
    const company = cleanValue(body.company);
    const url = cleanValue(body.url);

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "invalid_payload" },
        { status: 400 },
      );
    }

    await sendLeadSms({ name, phone, company, url });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[leads] Lead submission failed", error);
    return NextResponse.json(
      { success: false, error: "server_error" },
      { status: 500 },
    );
  }
}
