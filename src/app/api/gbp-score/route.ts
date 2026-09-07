import { NextResponse } from "next/server";

const googlePlacesApiKey = process.env.GOOGLE_PLACES_API_KEY;

interface GbpScorePayload {
  placeId?: string;
}

interface PlaceDetailsResult {
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  regularOpeningHours?: { weekdayDescriptions?: string[] };
  photos?: { name: string }[];
  websiteUri?: string;
  internationalPhoneNumber?: string;
  editorialSummary?: { text?: string };
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

const PLACE_DETAILS_FIELD_MASK = [
  "displayName",
  "rating",
  "userRatingCount",
  "regularOpeningHours",
  "photos",
  "websiteUri",
  "internationalPhoneNumber",
  "editorialSummary",
].join(",");

async function fetchPlaceDetails(placeId: string): Promise<PlaceDetailsResult> {
  const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": googlePlacesApiKey!,
      "X-Goog-FieldMask": PLACE_DETAILS_FIELD_MASK,
    },
  });

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    console.error("[gbp-score] places.get rejected", response.status, bodyText);
    throw new Error(`place_details_failed_${response.status}`);
  }

  return (await response.json()) as PlaceDetailsResult;
}

function buildChecks(place: PlaceDetailsResult): Check[] {
  const hasOpeningHours = Boolean(place.regularOpeningHours?.weekdayDescriptions?.length);
  const photoCount = place.photos?.length ?? 0;
  const hasEnoughPhotos = photoCount >= 5;
  const hasPhone = Boolean(place.internationalPhoneNumber);
  const hasWebsite = Boolean(place.websiteUri);
  const ratingsCount = place.userRatingCount ?? 0;
  const hasEnoughRatings = ratingsCount >= 10;
  const hasEditorialSummary = Boolean(place.editorialSummary?.text);

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

    if (!placeId) {
      return NextResponse.json(
        { success: false, error: "invalid_payload" },
        { status: 400 },
      );
    }

    const place = await fetchPlaceDetails(placeId);
    const checks = buildChecks(place);
    const score = checks.reduce((total, check) => total + (check.passed ? check.points : 0), 0);

    return NextResponse.json(
      {
        success: true,
        name: place.displayName?.text ?? "",
        rating: place.rating ?? null,
        userRatingsTotal: place.userRatingCount ?? 0,
        score,
        checks,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[gbp-score] Google Business Profile score failed", error);
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
