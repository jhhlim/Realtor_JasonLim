import type {
  ListingDetails,
  ListingPhoto,
  ListingStatus,
  ListingSummary,
  PriceHistoryItem,
  PropertyType,
  SchoolInfo,
  ScoreBundle,
  SearchFilters,
  SearchResult,
  TaxHistoryItem,
} from "@/types";
import type { ListingProvider } from "@/services/listings/types";

/**
 * RapidAPI-style RealtyAPI adapter (realty-in-us.p.rapidapi.com pattern).
 *
 * Env:
 * - REALTY_API_KEY
 * - REALTY_API_HOST (default: realty-in-us.p.rapidapi.com)
 *
 * Methods map to common endpoints:
 * - search → POST /properties/v3/list
 * - getById / details → GET /properties/v3/detail
 * - nearby schools → GET /schools/list
 * - walk score → derived from detail / location enrichment
 * - photos → detail.photos
 * - history → price / tax history on detail
 */
type RealtyApiConfig = {
  apiKey: string;
  host: string;
};

type RealtyListItem = {
  property_id?: string;
  listing_id?: string;
  mls?: string | { id?: string };
  status?: string;
  list_price?: number;
  description?: { beds?: number; baths?: number; sqft?: number; type?: string; year_built?: number; text?: string; lot_sqft?: number };
  location?: {
    address?: {
      line?: string;
      unit?: string;
      city?: string;
      state_code?: string;
      postal_code?: string;
      neighborhood_name?: string;
    };
    address_new?: { coordinate?: { lat?: number; lon?: number } };
  };
  primary_photo?: { href?: string };
  photos?: { href?: string; description?: string }[];
  flags?: { is_new_construction?: boolean; is_price_reduced?: boolean; is_pending?: boolean };
  list_date?: string;
  open_houses?: { start_date?: string }[];
  branding?: unknown;
};

type RealtyDetailResponse = {
  data?: RealtyListItem & {
    details?: { category?: string; text?: string[] }[];
    schools?: { schools?: { name?: string; education_levels?: string[]; rating?: number; distance_in_miles?: number; grades?: string[] }[] };
    taxes?: { year?: number; tax?: number; assessment?: { total?: number } }[];
    property_history?: { date?: string; event_name?: string; price?: number }[];
    estimates?: { current_values?: { estimate?: number }[] };
    local?: { noise?: unknown; flood?: unknown };
  };
};

function requireConfig(): RealtyApiConfig {
  const apiKey = process.env.REALTY_API_KEY;
  const host = process.env.REALTY_API_HOST ?? "realty-in-us.p.rapidapi.com";
  if (!apiKey) {
    throw new Error(
      "Not configured: set REALTY_API_KEY (and optionally REALTY_API_HOST) for RealtyAPIListingProvider",
    );
  }
  return { apiKey, host };
}

function mapStatus(raw?: string, flags?: RealtyListItem["flags"]): ListingStatus {
  const s = (raw ?? "").toLowerCase();
  if (flags?.is_pending || s.includes("pending")) return "pending";
  if (s.includes("sold") || s.includes("closed")) return "sold";
  if (s.includes("coming")) return "coming_soon";
  if (s.includes("withdraw")) return "withdrawn";
  return "active";
}

function mapPropertyType(raw?: string): PropertyType {
  const t = (raw ?? "").toLowerCase();
  if (t.includes("condo")) return "condo";
  if (t.includes("town")) return "townhome";
  if (t.includes("multi") || t.includes("duplex")) return "multi_family";
  if (t.includes("land") || t.includes("lot")) return "land";
  if (t.includes("single") || t.includes("home") || t.includes("residential")) return "single_family";
  return "other";
}

function mlsOf(item: RealtyListItem): string {
  if (typeof item.mls === "string") return item.mls;
  return item.mls?.id ?? item.listing_id ?? item.property_id ?? "UNKNOWN";
}

function slugify(street: string, city: string, id: string): string {
  return `${street}-${city}-${id}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mapSummary(item: RealtyListItem): ListingSummary {
  const id = String(item.property_id ?? item.listing_id ?? mlsOf(item));
  const addr = item.location?.address ?? {};
  const coord = item.location?.address_new?.coordinate;
  const street = addr.line ?? "Address unavailable";
  const city = addr.city ?? "";
  const photo = item.primary_photo?.href ?? item.photos?.[0]?.href ?? "";
  return {
    id,
    mlsNumber: mlsOf(item),
    slug: slugify(street, city, id),
    status: mapStatus(item.status, item.flags),
    propertyType: mapPropertyType(item.description?.type),
    listPrice: item.list_price ?? 0,
    beds: item.description?.beds ?? 0,
    baths: item.description?.baths ?? 0,
    sqft: item.description?.sqft ?? 0,
    lotSizeSqft: item.description?.lot_sqft,
    yearBuilt: item.description?.year_built,
    address: {
      street,
      unit: addr.unit,
      city,
      state: addr.state_code ?? "CA",
      zip: addr.postal_code ?? "",
      neighborhood: addr.neighborhood_name,
    },
    geo: { lat: coord?.lat ?? 0, lng: coord?.lon ?? 0 },
    photo,
    photosCount: item.photos?.length ?? (photo ? 1 : 0),
    openHouse: item.open_houses?.[0]?.start_date,
    newConstruction: item.flags?.is_new_construction,
    priceReduced: item.flags?.is_price_reduced,
    featured: false,
  };
}

function mapPhotos(item: RealtyListItem): ListingPhoto[] {
  const photos = item.photos?.length
    ? item.photos
    : item.primary_photo
      ? [item.primary_photo]
      : [];
  return photos.map((p, order) => {
    const caption =
      "description" in p && typeof p.description === "string"
        ? p.description
        : undefined;
    return {
      url: p.href ?? "",
      caption,
      order,
    };
  });
}

function mapSchools(detail: RealtyDetailResponse["data"]): SchoolInfo[] {
  const schools = detail?.schools?.schools ?? [];
  return schools.map((s) => {
    const level = (s.education_levels?.[0] ?? "").toLowerCase();
    let type: SchoolInfo["type"] = "elementary";
    if (level.includes("high")) type = "high";
    else if (level.includes("middle") || level.includes("junior")) type = "middle";
    else if (level.includes("private")) type = "private";
    else if (level.includes("charter")) type = "charter";
    return {
      name: s.name ?? "School",
      type,
      rating: s.rating,
      distanceMiles: s.distance_in_miles,
      grades: s.grades?.join("-"),
    };
  });
}

function mapTaxHistory(detail: RealtyDetailResponse["data"]): TaxHistoryItem[] {
  return (detail?.taxes ?? []).map((t) => ({
    year: t.year ?? 0,
    amount: t.tax ?? 0,
    assessment: t.assessment?.total,
  }));
}

function mapPriceHistory(detail: RealtyDetailResponse["data"]): PriceHistoryItem[] {
  return (detail?.property_history ?? []).map((h) => ({
    date: h.date ?? "",
    event: h.event_name ?? "Update",
    price: h.price,
  }));
}

function mapScores(_detail: RealtyDetailResponse["data"]): ScoreBundle {
  // RealtyAPI does not always include Walk Score; leave undefined when absent.
  return {};
}

function mapDetails(detail: RealtyDetailResponse["data"]): ListingDetails | null {
  if (!detail) return null;
  const summary = mapSummary(detail);
  const featureTexts =
    detail.details?.flatMap((d) => d.text ?? []).filter(Boolean) ?? [];
  return {
    ...summary,
    description:
      detail.description?.text ??
      (featureTexts.slice(0, 3).join(" ") || "No description available."),
    photos: mapPhotos(detail),
    features: featureTexts,
    schools: mapSchools(detail),
    scores: mapScores(detail),
    taxHistory: mapTaxHistory(detail),
    priceHistory: mapPriceHistory(detail),
    comps: [],
    estimatedValue: detail.estimates?.current_values?.[0]?.estimate,
    propertyHistory: (detail.property_history ?? []).map(
      (h) => `${h.date ?? ""}: ${h.event_name ?? "Event"}${h.price != null ? ` @ $${h.price}` : ""}`,
    ),
  };
}

export class RealtyAPIListingProvider implements ListingProvider {
  readonly name = "realtyapi";

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const { apiKey, host } = requireConfig();
    const url = `https://${host}${path}`;
    const res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": host,
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`RealtyAPI error ${res.status}: ${body || res.statusText}`);
    }
    return (await res.json()) as T;
  }

  /** Search / list-for-sale style query with filters, sort, pagination. */
  async search(filters: SearchFilters): Promise<SearchResult> {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const pageSize = filters.pageSize && filters.pageSize > 0 ? filters.pageSize : 12;
    const body = {
      limit: pageSize,
      offset: (page - 1) * pageSize,
      postal_code: filters.zip,
      city: filters.city,
      state_code: "CA",
      list_price: {
        min: filters.minPrice,
        max: filters.maxPrice,
      },
      beds: filters.beds != null ? { min: filters.beds } : undefined,
      baths: filters.baths != null ? { min: filters.baths } : undefined,
      sqft: {
        min: filters.minSqft,
        max: filters.maxSqft,
      },
      status: filters.status?.length ? filters.status : ["for_sale", "ready_to_build"],
      sort: {
        direction: filters.sort === "price_asc" ? "asc" : "desc",
        field:
          filters.sort === "sqft_desc"
            ? "sqft"
            : filters.sort === "newest" || filters.sort === "dom_asc"
              ? "list_date"
              : "list_price",
      },
    };

    const data = await this.request<{ data?: { results?: RealtyListItem[]; count?: number; total?: number } }>(
      "/properties/v3/list",
      { method: "POST", body: JSON.stringify(body) },
    );

    const results = data.data?.results ?? [];
    return {
      items: results.map(mapSummary),
      total: data.data?.total ?? data.data?.count ?? results.length,
      page,
      pageSize,
      provider: this.name,
    };
  }

  /** Property details by Realty property_id. */
  async getById(id: string): Promise<ListingDetails | null> {
    const data = await this.request<RealtyDetailResponse>(
      `/properties/v3/detail?property_id=${encodeURIComponent(id)}`,
      { method: "GET" },
    );
    return mapDetails(data.data);
  }

  /** Lookup by MLS number via list filter, then hydrate details. */
  async getByMlsNumber(mlsNumber: string): Promise<ListingDetails | null> {
    const data = await this.request<{ data?: { results?: RealtyListItem[] } }>(
      "/properties/v3/list",
      {
        method: "POST",
        body: JSON.stringify({
          limit: 1,
          offset: 0,
          mls_id: mlsNumber,
          state_code: "CA",
        }),
      },
    );
    const first = data.data?.results?.[0];
    if (!first?.property_id) return null;
    return this.getById(String(first.property_id));
  }

  async getFeatured(limit = 6): Promise<ListingSummary[]> {
    const result = await this.search({
      status: ["active", "coming_soon"],
      sort: "newest",
      page: 1,
      pageSize: limit,
      city: "San Jose",
    });
    return result.items.map((item) => ({ ...item, featured: true }));
  }

  async getRecentSales(limit = 6): Promise<ListingSummary[]> {
    const { apiKey, host } = requireConfig();
    const url = `https://${host}/properties/v3/list`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": host,
      },
      body: JSON.stringify({
        limit,
        offset: 0,
        status: ["sold"],
        state_code: "CA",
        city: "San Jose",
        sort: { direction: "desc", field: "list_date" },
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`RealtyAPI error ${res.status}: failed to fetch recent sales`);
    }
    const data = (await res.json()) as { data?: { results?: RealtyListItem[] } };
    return (data.data?.results ?? []).map(mapSummary);
  }

  /** Nearby schools for a property (schools/list style). */
  async getNearbySchools(propertyId: string): Promise<SchoolInfo[]> {
    const detail = await this.getById(propertyId);
    return detail?.schools ?? [];
  }

  /** Walk / transit / bike scores when available on detail payload. */
  async getWalkScore(propertyId: string): Promise<ScoreBundle> {
    const detail = await this.getById(propertyId);
    return detail?.scores ?? {};
  }

  /** Photo gallery from property detail. */
  async getPhotos(propertyId: string): Promise<ListingPhoto[]> {
    const detail = await this.getById(propertyId);
    return detail?.photos ?? [];
  }

  /** Price + tax history from property detail. */
  async getHistory(propertyId: string): Promise<{
    priceHistory: PriceHistoryItem[];
    taxHistory: TaxHistoryItem[];
    propertyHistory: string[];
  }> {
    const detail = await this.getById(propertyId);
    return {
      priceHistory: detail?.priceHistory ?? [],
      taxHistory: detail?.taxHistory ?? [],
      propertyHistory: detail?.propertyHistory ?? [],
    };
  }
}
