import { NextResponse } from "next/server";

const googlePlacesApiKey = process.env.GOOGLE_PLACES_API_KEY;

interface FindByPhonePayload {
  phone?: string;
}

interface FindPlaceCandidate {
  place_id: string;
  name?: string;
  formatted_address?: string;
}

interface FindPlaceResponse {
  status: string;
  candidates?: FindPlaceCandidate[];
  error_message?: string;
}

function cleanValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePhoneToE164(input: string): string | null {
  const digitsOnly = input.replace(/\D/g, "");
  let local = digitsOnly;

  if (local.startsWith("90") && local.length > 10) {
    local = local.slice(2);
  }

  if (local.startsWith("0")) {
    local = local.slice(1);
  }

  if (!/^\d{10}$/.test(local)) return null;

  return `+90${local}`;
}

export async function POST(request: Request) {
  try {
    if (!googlePlacesApiKey) {
      return NextResponse.json({ error: "google_places_api_key_missing" }, { status: 500 });
    }

    const body = (await request.json()) as FindByPhonePayload;
    const normalizedPhone = normalizePhoneToE164(cleanValue(body.phone));

    if (!normalizedPhone) {
      return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
    }

    const url = new URL("https://maps.googleapis.com/maps/api/place/findplacefromtext/json");
    url.searchParams.set("input", normalizedPhone);
    url.searchParams.set("inputtype", "phonenumber");
    url.searchParams.set("fields", "place_id,name,formatted_address");
    url.searchParams.set("key", googlePlacesApiKey);

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error("[find-by-phone] findplacefromtext request failed", response.status);
      return NextResponse.json({ error: "Bulunamadı" }, { status: 200 });
    }

    const data = (await response.json()) as FindPlaceResponse;

    if (data.status !== "OK" || !data.candidates?.length) {
      console.error("[find-by-phone] no match", data.status, data.error_message);
      return NextResponse.json({ error: "Bulunamadı" }, { status: 200 });
    }

    const candidate = data.candidates[0];

    return NextResponse.json(
      {
        place_id: candidate.place_id,
        name: candidate.name ?? "",
        address: candidate.formatted_address ?? "",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[find-by-phone] lookup failed", error);
    return NextResponse.json({ error: "Bulunamadı" }, { status: 200 });
  }
}
