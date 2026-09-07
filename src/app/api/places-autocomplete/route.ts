import { NextResponse } from "next/server";

const googlePlacesApiKey = process.env.GOOGLE_PLACES_API_KEY;

interface AutocompletePayload {
  input?: string;
}

interface PlacePrediction {
  placeId: string;
  text?: { text?: string };
  structuredFormat?: {
    mainText?: { text?: string };
    secondaryText?: { text?: string };
  };
}

interface AutocompleteResponse {
  suggestions?: { placePrediction?: PlacePrediction }[];
}

function cleanValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    if (!googlePlacesApiKey) {
      return NextResponse.json({ success: false, error: "google_places_api_key_missing" }, { status: 500 });
    }

    const body = (await request.json()) as AutocompletePayload;
    const input = cleanValue(body.input);

    if (!input || input.length < 2) {
      return NextResponse.json({ success: true, suggestions: [] }, { status: 200 });
    }

    const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": googlePlacesApiKey,
      },
      body: JSON.stringify({
        input,
        includedRegionCodes: ["tr"],
        languageCode: "tr",
        includedPrimaryTypes: ["establishment"],
      }),
    });

    if (!response.ok) {
      const bodyText = await response.text().catch(() => "");
      console.error("[places-autocomplete] request rejected", response.status, bodyText);
      return NextResponse.json({ success: false, error: "autocomplete_failed" }, { status: 500 });
    }

    const data = (await response.json()) as AutocompleteResponse;

    const suggestions = (data.suggestions ?? [])
      .map((suggestion) => suggestion.placePrediction)
      .filter((prediction): prediction is PlacePrediction => Boolean(prediction))
      .slice(0, 5)
      .map((prediction) => ({
        placeId: prediction.placeId,
        mainText: prediction.structuredFormat?.mainText?.text ?? prediction.text?.text ?? "",
        secondaryText: prediction.structuredFormat?.secondaryText?.text ?? "",
      }));

    return NextResponse.json({ success: true, suggestions }, { status: 200 });
  } catch (error) {
    console.error("[places-autocomplete] lookup failed", error);
    return NextResponse.json({ success: false, error: "autocomplete_failed" }, { status: 500 });
  }
}
