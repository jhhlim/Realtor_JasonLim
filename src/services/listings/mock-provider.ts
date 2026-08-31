import type {
  ListingDetails,
  ListingSummary,
  SearchFilters,
  SearchResult,
} from "@/types";
import { mockListings } from "@/data/mock-listings";
import { isMockListingsEnabled } from "@/lib/listings-mode";
import type { ListingProvider } from "@/services/listings/types";

function toSummary(listing: ListingDetails): ListingSummary {
  const {
    description: _d,
    photos: _p,
    features: _f,
    schools: _s,
    scores: _sc,
    taxHistory: _t,
    priceHistory: _ph,
    comps: _c,
    estimatedValue: _e,
    propertyHistory: _pr,
    streetViewUrl: _sv,
    ...summary
  } = listing;
  return summary;
}

function pointInPolygon(point: { lat: number; lng: number }, polygon: { lat: number; lng: number }[]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i]!.lng;
    const yi = polygon[i]!.lat;
    const xj = polygon[j]!.lng;
    const yj = polygon[j]!.lat;
    const intersect =
      yi > point.lat !== yj > point.lat &&
      point.lng < ((xj - xi) * (point.lat - yi)) / (yj - yi + Number.EPSILON) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function normalizeZip(value?: string): string | undefined {
  if (!value) return undefined;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 5 ? digits.slice(0, 5) : undefined;
}

function matchesFilters(listing: ListingDetails, filters: SearchFilters): boolean {
  const queryZip = normalizeZip(filters.query);
  const filterZip = normalizeZip(filters.zip) ?? queryZip;

  if (filters.query && !queryZip) {
    const q = filters.query.trim().toLowerCase();
    const hay = [
      listing.address.street,
      listing.address.city,
      listing.address.zip,
      listing.address.neighborhood ?? "",
      listing.mlsNumber,
      listing.description,
    ]
      .join(" ")
      .toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (filters.city && listing.address.city.toLowerCase() !== filters.city.toLowerCase()) {
    return false;
  }
  if (filterZip && listing.address.zip !== filterZip) return false;
  if (filters.mlsNumber && listing.mlsNumber.toLowerCase() !== filters.mlsNumber.toLowerCase()) {
    return false;
  }
  if (
    filters.neighborhood &&
    (listing.address.neighborhood ?? "").toLowerCase() !== filters.neighborhood.toLowerCase()
  ) {
    return false;
  }
  if (filters.schoolDistrict) {
    const district = filters.schoolDistrict.toLowerCase();
    const hit = listing.schools.some((s) => s.name.toLowerCase().includes(district));
    if (!hit) return false;
  }
  if (filters.minPrice != null && listing.listPrice < filters.minPrice) return false;
  if (filters.maxPrice != null && listing.listPrice > filters.maxPrice) return false;
  if (filters.beds != null && listing.beds < filters.beds) return false;
  if (filters.baths != null && listing.baths < filters.baths) return false;
  if (filters.minSqft != null && listing.sqft < filters.minSqft) return false;
  if (filters.maxSqft != null && listing.sqft > filters.maxSqft) return false;
  if (filters.minLotSize != null && (listing.lotSizeSqft ?? 0) < filters.minLotSize) return false;
  if (filters.maxHoa != null && (listing.hoaMonthly ?? 0) > filters.maxHoa) return false;
  if (filters.garage && !(listing.garageSpaces && listing.garageSpaces > 0)) return false;
  if (filters.pool && !listing.pool) return false;
  if (filters.openHouse && !listing.openHouse) return false;
  if (filters.newConstruction && !listing.newConstruction) return false;
  if (filters.priceReduced && !listing.priceReduced) return false;
  if (filters.status?.length && !filters.status.includes(listing.status)) return false;
  if (filters.propertyType?.length && !filters.propertyType.includes(listing.propertyType)) {
    return false;
  }
  if (filters.bounds) {
    const { north, south, east, west } = filters.bounds;
    const { lat, lng } = listing.geo;
    if (lat > north || lat < south || lng > east || lng < west) return false;
  }
  if (filters.polygon?.length && !pointInPolygon(listing.geo, filters.polygon)) return false;
  return true;
}

function sortListings(items: ListingDetails[], sort?: SearchFilters["sort"]): ListingDetails[] {
  const sorted = [...items];
  switch (sort) {
    case "price_asc":
      return sorted.sort((a, b) => a.listPrice - b.listPrice);
    case "price_desc":
      return sorted.sort((a, b) => b.listPrice - a.listPrice);
    case "sqft_desc":
      return sorted.sort((a, b) => b.sqft - a.sqft);
    case "dom_asc":
      return sorted.sort((a, b) => (a.daysOnMarket ?? 999) - (b.daysOnMarket ?? 999));
    case "newest":
    default:
      return sorted.sort((a, b) => (a.daysOnMarket ?? 999) - (b.daysOnMarket ?? 999));
  }
}

function emptyResult(filters: SearchFilters): SearchResult {
  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const pageSize = filters.pageSize && filters.pageSize > 0 ? filters.pageSize : 12;
  return {
    items: [],
    total: 0,
    page,
    pageSize,
    provider: "mock",
  };
}

/**
 * Local UI provider. Returns no inventory unless SHOW_MOCK_LISTINGS=true
 * so fake addresses never appear on the live site.
 */
export class MockListingProvider implements ListingProvider {
  readonly name = "mock";

  async search(filters: SearchFilters): Promise<SearchResult> {
    if (!isMockListingsEnabled()) return emptyResult(filters);

    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const pageSize = filters.pageSize && filters.pageSize > 0 ? filters.pageSize : 12;
    const filtered = sortListings(
      mockListings.filter((l) => matchesFilters(l, filters)),
      filters.sort,
    );
    const start = (page - 1) * pageSize;
    const slice = filtered.slice(start, start + pageSize);
    return {
      items: slice.map(toSummary),
      total: filtered.length,
      page,
      pageSize,
      provider: this.name,
    };
  }

  async getById(id: string): Promise<ListingDetails | null> {
    if (!isMockListingsEnabled()) return null;
    return mockListings.find((l) => l.id === id) ?? null;
  }

  async getByMlsNumber(mlsNumber: string): Promise<ListingDetails | null> {
    if (!isMockListingsEnabled()) return null;
    return (
      mockListings.find((l) => l.mlsNumber.toLowerCase() === mlsNumber.toLowerCase()) ?? null
    );
  }

  async getFeatured(limit = 6): Promise<ListingSummary[]> {
    if (!isMockListingsEnabled()) return [];
    return mockListings
      .filter((l) => l.featured && (l.status === "active" || l.status === "coming_soon"))
      .slice(0, limit)
      .map(toSummary);
  }

  async getRecentSales(limit = 6): Promise<ListingSummary[]> {
    if (!isMockListingsEnabled()) return [];
    return mockListings
      .filter((l) => l.status === "sold")
      .slice(0, limit)
      .map(toSummary);
  }
}
