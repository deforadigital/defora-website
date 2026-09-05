import { NextResponse } from "next/server";

const googlePlacesApiKey = process.env.GOOGLE_PLACES_API_KEY;

interface GbpScorePayload {
  businessName?: string;
  city?: string;
  placeId?: string;
  mapsUrl?: string;
}

interface PlaceTextSearchResult {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
}

interface PlaceTextSearchResponse {
  places?: PlaceTextSearchResult[];
}

interface PlaceCandidate {
  placeId: string;
  name: string;
  address: string;
}

interface PlaceDetailsResult {
  name?: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: { weekday_text?: string[] };
  photos?: { photo_reference: string }[];
  website?: string;
  formatted_phone_number?: string;
  types?: string[];
  editorial_summary?: { overview?: string };
}

interface PlaceDetailsResponse {
  status: string;
  result?: PlaceDetailsResult;
}

interface Check {
  name: string;
  passed: boolean;
  points: number;
  description: string;
}

function cleanValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function searchPlaceCandidates(query: string): Promise<PlaceCandidate[]> {
  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": googlePlacesApiKey!,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress",
    },
    body: JSON.stringify({ textQuery: query, languageCode: "tr" }),
  });

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    console.error("[gbp-score] places:searchText rejected", response.status, bodyText);
    throw new Error(`places_text_search_failed_${response.status}`);
  }

  const data = (await response.json()) as PlaceTextSearchResponse;

  if (!data.places?.length) {
    throw new Error("place_not_found");
  }

  return data.places.slice(0, 5).map((place) => ({
    placeId: place.id,
    name: place.displayName?.text ?? "",
    address: place.formattedAddress ?? "",
  }));
}

const PLACE_ID_PATTERN = /!1s(ChIJ[^!]+)/;
const SHORT_MAPS_LINK_HOSTS = ["share.google", "maps.app.goo.gl"];

function extractPlaceIdFromMapsUrl(mapsUrl: string): string {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(mapsUrl);
  } catch {
    throw new Error("invalid_maps_url");
  }

  if (SHORT_MAPS_LINK_HOSTS.some((host) => parsedUrl.hostname.includes(host))) {
    throw new Error("short_maps_link");
  }

  const match = mapsUrl.match(PLACE_ID_PATTERN);

  if (!match) {
    throw new Error("invalid_maps_url");
  }

  return match[1];
}

async function fetchPlaceDetails(placeId: string): Promise<PlaceDetailsResult> {
  const fields = [
    "name",
    "rating",
    "user_ratings_total",
    "opening_hours",
    "photos",
    "website",
    "formatted_phone_number",
    "types",
    "editorial_summary",
  ].join(",");

  const detailsUrl = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  detailsUrl.searchParams.set("place_id", placeId);
  detailsUrl.searchParams.set("fields", fields);
  detailsUrl.searchParams.set("key", googlePlacesApiKey!);
  detailsUrl.searchParams.set("language", "tr");

  const response = await fetch(detailsUrl.toString());

  if (!response.ok) {
    throw new Error(`place_details_failed_${response.status}`);
  }

  const data = (await response.json()) as PlaceDetailsResponse;

  if (data.status !== "OK" || !data.result) {
    throw new Error(`place_details_not_ok: ${data.status}`);
  }

  return data.result;
}

function buildChecks(place: PlaceDetailsResult): Check[] {
  const hasOpeningHours = Boolean(place.opening_hours?.weekday_text?.length);
  const photoCount = place.photos?.length ?? 0;
  const hasEnoughPhotos = photoCount >= 5;
  const hasPhone = Boolean(place.formatted_phone_number);
  const hasWebsite = Boolean(place.website);
  const ratingsCount = place.user_ratings_total ?? 0;
  const hasEnoughRatings = ratingsCount >= 10;
  const hasEditorialSummary = Boolean(place.editorial_summary?.overview);

  return [
    {
      name: "Çalışma Saatleri",
      passed: hasOpeningHours,
      points: 20,
      description: hasOpeningHours
        ? "İşletmenizin çalışma saatleri Google'da görünüyor."
        : "Çalışma saatleriniz eksik. Müşteriler ne zaman açık olduğunuzu bilemiyor.",
    },
    {
      name: "Fotoğraflar",
      passed: hasEnoughPhotos,
      points: 20,
      description: hasEnoughPhotos
        ? `İşletmenizde ${photoCount} fotoğraf var, bu yeterli.`
        : `Şu anda ${photoCount} fotoğrafınız var. En az 5 fotoğraf, güven oluşturmak için önemli.`,
    },
    {
      name: "Telefon Numarası",
      passed: hasPhone,
      points: 15,
      description: hasPhone
        ? "Telefon numaranız profilde görünüyor."
        : "Telefon numaranız eksik. Müşteriler sizi arayamıyor.",
    },
    {
      name: "Web Sitesi",
      passed: hasWebsite,
      points: 15,
      description: hasWebsite
        ? "Web siteniz profilinize bağlanmış."
        : "Web sitesi bağlantınız yok. Müşteriler işletmenizi daha iyi tanıyamıyor.",
    },
    {
      name: "Müşteri Yorumları",
      passed: hasEnoughRatings,
      points: 20,
      description: hasEnoughRatings
        ? `${ratingsCount} müşteri yorumunuz var, bu güven verici bir sayı.`
        : `Şu anda ${ratingsCount} yorumunuz var. En az 10 yorum, yeni müşterilerin size güvenmesini sağlar.`,
    },
    {
      name: "İşletme Açıklaması",
      passed: hasEditorialSummary,
      points: 10,
      description: hasEditorialSummary
        ? "İşletmenizin kısa bir tanıtım açıklaması var."
        : "İşletmenizi anlatan bir açıklama bulunmuyor.",
    },
  ];
}

export async function POST(request: Request) {
  try {
    if (!googlePlacesApiKey) {
      return NextResponse.json(
        { success: false, error: "google_places_api_key_missing" },
        { status: 500 },
      );
    }

    const body = (await request.json()) as GbpScorePayload;
    const placeId = cleanValue(body.placeId);
    const mapsUrl = cleanValue(body.mapsUrl);

    if (placeId || mapsUrl) {
      const resolvedPlaceId = placeId || extractPlaceIdFromMapsUrl(mapsUrl);
      const place = await fetchPlaceDetails(resolvedPlaceId);
      const checks = buildChecks(place);
      const score = checks.reduce((total, check) => total + (check.passed ? check.points : 0), 0);

      return NextResponse.json(
        {
          success: true,
          name: place.name ?? "",
          rating: place.rating ?? null,
          userRatingsTotal: place.user_ratings_total ?? 0,
          score,
          checks,
        },
        { status: 200 },
      );
    }

    const businessName = cleanValue(body.businessName);
    const city = cleanValue(body.city);

    if (!businessName || !city) {
      return NextResponse.json(
        { success: false, error: "invalid_payload" },
        { status: 400 },
      );
    }

    const candidates = await searchPlaceCandidates(`${businessName} ${city}`);

    return NextResponse.json({ success: true, candidates }, { status: 200 });
  } catch (error) {
    console.error("[gbp-score] Google Business Profile score failed", error);
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
