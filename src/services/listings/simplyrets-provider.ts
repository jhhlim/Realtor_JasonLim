import type {
  ListingDetails,
  ListingPhoto,
  ListingStatus,
  ListingSummary,
  PropertyType,
  SearchFilters,
  SearchResult,
} from "@/types";
import type { ListingProvider } from "@/services/listings/types";

/**
 * SimplyRETS MLS adapter.
 *
 * Free demo credentials (Houston-area sample MLS data, not Bay Area live feed):
 *   SIMPLYRETS_USERNAME=simplyrets
 *   SIMPLYRETS_PASSWORD=simplyrets
 *
 * For live Bay Area MLSListings / Bridge IDX, set production credentials from
 * your MLS / Compass and keep MLS_PROVIDER=simplyrets (or switch to bridge).
 *
 * Docs: https://docs.simplyrets.com/
 */

const DEFAULT_BASE = "https://api.simplyrets.com";

type SimplyRetsProperty = {
  mlsId?: number | string;
  listingId?: string;
  status?: string;
  listDate?: string;
  listPrice?: number;
  originalListPrice?: number;
  remarks?: string;
  address?: {
    full?: string;
    unit?: string;
    streetNumber?: string | number;
    streetName?: string;
    streetSuffix?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  property?: {
    bedrooms?: number;
    bathsFull?: number;
    bathsHalf?: number;
    bathsTotal?: number;
    area?: number;
    lotSize?: string | number;
    type?: string;
    subType?: string;
    yearBuilt?: number;
    garageSpaces?: number;
    stories?: number;
  };
  geo?: {
    lat?: number;
    lng?: number;
    county?: string;
    marketArea?: string;
  };
  photos?: string[];
  agent?: {
    firstName?: string;
    lastName?: string;
    contact?: { email?: string; office?: string; cell?: string };
    id?: string;
  };
  coAgent?: {
    firstName?: string;
    lastName?: string;
  };
  office?: {
    name?: string;
    contact?: { email?: string; office?: string };
    servingName?: string;
  };
  association?: { fee?: number; name?: string; amenities?: string[] };
  school?: {
    elementarySchool?: string;
    middleSchool?: string;
    highSchool?: string;
    district?: string;
  };
  modified?: string;
};

function credentials() {
  const username = process.env.SIMPLYRETS_USERNAME?.trim() || "simplyrets";
  const password = process.env.SIMPLYRETS_PASSWORD?.trim() || "simplyrets";
  return { username, password };
}

function authHeader() {
  const { username, password } = credentials();
  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}

function slugify(parts: (string | number | undefined | null)[]) {
  return parts
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

function mapStatus(raw?: string): ListingStatus {
  const s = (raw ?? "").toLowerCase();
  if (s.includes("pend") || s.includes("under") || s.includes("conting")) {
    return "pending";
  }
  if (s.includes("sold") || s.includes("closed")) return "sold";
  if (s.includes("coming")) return "coming_soon";
  if (s.includes("withdr") || s.includes("expire") || s.includes("cancel")) {
    return "withdrawn";
  }
  return "active";
}

function mapPropertyType(raw?: string): PropertyType {
  const t = (raw ?? "").toLowerCase();
  if (t.includes("condo") || t.includes("condominium")) return "condo";
  if (t.includes("town")) return "townhome";
  if (t.includes("multi") || t.includes("duplex") || t.includes("fourplex")) {
    return "multi_family";
  }
  if (t.includes("land") || t.includes("lot")) return "land";
  if (t.includes("res") || t.includes("single") || t.includes("detached")) {
    return "single_family";
  }
  return "other";
}

function agentName(agent?: SimplyRetsProperty["agent"]) {
  if (!agent) return undefined;
  const name = [agent.firstName, agent.lastName].filter(Boolean).join(" ").trim();
  return name || undefined;
}

function streetFrom(address?: SimplyRetsProperty["address"]) {
  if (!address) return "Address withheld";
  if (address.full?.trim()) {
    const full = address.full.trim();
    // Prefer street without city if "full" is a long line
    const beforeComma = full.split(",")[0]?.trim();
    return beforeComma || full;
  }
  return (
    [address.streetNumber, address.streetName, address.streetSuffix]
      .filter(Boolean)
      .join(" ")
      .trim() || "Address withheld"
  );
}

function lotSizeSqft(raw?: string | number) {
  if (raw == null) return undefined;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  const n = Number(String(raw).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function baths(property?: SimplyRetsProperty["property"]) {
  if (!property) return 0;
  if (property.bathsTotal != null) return property.bathsTotal;
  const full = property.bathsFull ?? 0;
  const half = property.bathsHalf ?? 0;
  return full + half * 0.5;
}

function mapSummary(item: SimplyRetsProperty): ListingSummary {
  const mlsId = String(item.mlsId ?? item.listingId ?? "");
  const street = streetFrom(item.address);
  const city = item.address?.city ?? "";
  const photos = (item.photos ?? []).filter(Boolean);
  const photo =
    photos[0] ??
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80";

  return {
    id: mlsId,
    mlsNumber: String(item.listingId ?? item.mlsId ?? mlsId),
    slug: slugify([street, city, mlsId]),
    status: mapStatus(item.status),
    propertyType: mapPropertyType(item.property?.type ?? item.property?.subType),
    listPrice: item.listPrice ?? 0,
    beds: item.property?.bedrooms ?? 0,
    baths: baths(item.property),
    sqft: item.property?.area ?? 0,
    lotSizeSqft: lotSizeSqft(item.property?.lotSize),
    yearBuilt: item.property?.yearBuilt,
    address: {
      street,
      unit: item.address?.unit || undefined,
      city,
      state: item.address?.state ?? "",
      zip: item.address?.postalCode ?? "",
      neighborhood: item.geo?.marketArea || undefined,
    },
    geo: {
      lat: item.geo?.lat ?? 0,
      lng: item.geo?.lng ?? 0,
    },
    photo,
    photosCount: Math.max(photos.length, 1),
    hoaMonthly: item.association?.fee,
    garageSpaces: item.property?.garageSpaces,
    listingAgentName: agentName(item.agent),
    listingOffice: item.office?.name?.trim() || item.office?.servingName?.trim(),
    priceReduced:
      item.originalListPrice != null &&
      item.listPrice != null &&
      item.listPrice < item.originalListPrice,
  };
}

function mapDetails(item: SimplyRetsProperty): ListingDetails {
  const summary = mapSummary(item);
  const photos: ListingPhoto[] = (item.photos ?? [])
    .filter(Boolean)
    .map((url, order) => ({ url, order }));
  if (!photos.length) {
    photos.push({ url: summary.photo, order: 0 });
  }

  const features: string[] = [];
  if (item.property?.stories) features.push(`${item.property.stories} stories`);
  if (item.property?.garageSpaces) {
    features.push(`${item.property.garageSpaces}-car garage`);
  }
  if (item.association?.amenities?.length) {
    features.push(...item.association.amenities.slice(0, 8));
  }

  const schools = [];
  if (item.school?.elementarySchool) {
    schools.push({
      name: item.school.elementarySchool,
      type: "elementary" as const,
    });
  }
  if (item.school?.middleSchool) {
    schools.push({ name: item.school.middleSchool, type: "middle" as const });
  }
  if (item.school?.highSchool) {
    schools.push({ name: item.school.highSchool, type: "high" as const });
  }

  return {
    ...summary,
    description:
      item.remarks?.trim() ||
      `${summary.address.street} in ${summary.address.city} — see MLS remarks for full details.`,
    photos,
    features,
    schools,
    scores: {},
    taxHistory: [],
    priceHistory: item.listDate
      ? [{ date: item.listDate.slice(0, 10), event: "Listed", price: item.listPrice }]
      : [],
    comps: [],
    propertyHistory: item.modified
      ? [`Last modified ${item.modified.slice(0, 10)}`]
      : [],
  };
}

function matchesFilters(item: ListingSummary, filters: SearchFilters) {
  if (filters.mlsNumber && item.mlsNumber !== filters.mlsNumber) return false;
  if (filters.city && item.address.city.toLowerCase() !== filters.city.toLowerCase()) {
    return false;
  }
  if (filters.zip && !item.address.zip.startsWith(filters.zip)) return false;
  if (filters.minPrice != null && item.listPrice < filters.minPrice) return false;
  if (filters.maxPrice != null && item.listPrice > filters.maxPrice) return false;
  if (filters.beds != null && item.beds < filters.beds) return false;
  if (filters.baths != null && item.baths < filters.baths) return false;
  if (filters.minSqft != null && item.sqft < filters.minSqft) return false;
  if (filters.maxSqft != null && item.sqft > filters.maxSqft) return false;
  if (filters.garage && !(item.garageSpaces && item.garageSpaces > 0)) return false;
  if (filters.propertyType?.length && !filters.propertyType.includes(item.propertyType)) {
    return false;
  }
  if (filters.status?.length && !filters.status.includes(item.status)) return false;
  if (filters.query) {
    const q = filters.query.toLowerCase();
    const hay = [
      item.address.street,
      item.address.city,
      item.address.zip,
      item.mlsNumber,
      item.listingAgentName,
      item.listingOffice,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function sortItems(items: ListingSummary[], sort?: SearchFilters["sort"]) {
  const copy = [...items];
  switch (sort) {
    case "price_asc":
      return copy.sort((a, b) => a.listPrice - b.listPrice);
    case "price_desc":
      return copy.sort((a, b) => b.listPrice - a.listPrice);
    case "sqft_desc":
      return copy.sort((a, b) => b.sqft - a.sqft);
    case "dom_asc":
      return copy.sort((a, b) => (a.daysOnMarket ?? 0) - (b.daysOnMarket ?? 0));
    case "newest":
    default:
      return copy;
  }
}

async function simplyRetsFetch(path: string, query?: Record<string, string>) {
  const base = process.env.SIMPLYRETS_BASE_URL?.trim() || DEFAULT_BASE;
  const url = new URL(path.startsWith("http") ? path : `${base}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value) url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: authHeader(),
      Accept: "application/json",
    },
    next: { revalidate: 900 },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`SimplyRETS ${res.status}: ${text.slice(0, 200)}`);
  }

  return res.json();
}

export class SimplyRetsListingProvider implements ListingProvider {
  readonly name = "simplyrets";

  async search(filters: SearchFilters): Promise<SearchResult> {
    const page = filters.page ?? 1;
    const pageSize = Math.min(filters.pageSize ?? 24, 50);
    const query: Record<string, string> = {
      limit: "500",
      status: "Active",
    };

    // SimplyRETS supports server-side filters when available
    if (filters.minPrice != null) query.minprice = String(filters.minPrice);
    if (filters.maxPrice != null) query.maxprice = String(filters.maxPrice);
    if (filters.beds != null) query.minbeds = String(filters.beds);
    if (filters.baths != null) query.minbaths = String(filters.baths);
    if (filters.city) query.cities = filters.city;
    if (filters.zip) query.q = filters.zip;
    else if (filters.query) query.q = filters.query;

    try {
      const raw = (await simplyRetsFetch("/properties", query)) as SimplyRetsProperty[];
      const mapped = (Array.isArray(raw) ? raw : []).map(mapSummary);
      const filtered = sortItems(
        mapped.filter((item) => matchesFilters(item, filters)),
        filters.sort,
      );
      const start = (page - 1) * pageSize;
      const items = filtered.slice(start, start + pageSize);

      return {
        items,
        total: filtered.length,
        page,
        pageSize,
        provider: this.name,
      };
    } catch (error) {
      console.error("[simplyrets/search]", error);
      return {
        items: [],
        total: 0,
        page,
        pageSize,
        provider: this.name,
      };
    }
  }

  async getById(id: string): Promise<ListingDetails | null> {
    try {
      const raw = (await simplyRetsFetch(`/properties/${encodeURIComponent(id)}`)) as
        | SimplyRetsProperty
        | SimplyRetsProperty[];
      const item = Array.isArray(raw) ? raw[0] : raw;
      if (!item) return null;
      return mapDetails(item);
    } catch (error) {
      console.error("[simplyrets/getById]", error);
      return null;
    }
  }

  async getByMlsNumber(mlsNumber: string): Promise<ListingDetails | null> {
    return this.getById(mlsNumber);
  }

  async getFeatured(limit = 6): Promise<ListingSummary[]> {
    const result = await this.search({ pageSize: limit, sort: "newest" });
    return result.items.slice(0, limit).map((item) => ({ ...item, featured: true }));
  }

  async getRecentSales(limit = 6): Promise<ListingSummary[]> {
    try {
      const raw = (await simplyRetsFetch("/properties", {
        limit: String(Math.max(limit, 12)),
        status: "Closed",
      })) as SimplyRetsProperty[];
      return (Array.isArray(raw) ? raw : [])
        .map(mapSummary)
        .map((item) => ({ ...item, status: "sold" as const }))
        .slice(0, limit);
    } catch {
      return [];
    }
  }
}
