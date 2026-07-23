import type {
  ListingDetails,
  NeighborhoodSummary,
  SearchFilters,
  SearchResult,
} from "@/types";
import { mockNeighborhoods } from "@/data/mock-neighborhoods";
import { siteConfig } from "@/config/site";
import { BridgeListingProvider } from "@/services/listings/bridge-provider";
import { EstatedListingProvider } from "@/services/listings/estated-provider";
import { IdxListingProvider } from "@/services/listings/idx-provider";
import { MlsGridListingProvider } from "@/services/listings/mls-grid-provider";
import { MockListingProvider } from "@/services/listings/mock-provider";
import { RealtyAPIListingProvider } from "@/services/listings/realty-api-provider";
import { ResoListingProvider } from "@/services/listings/reso-provider";
import { SimplyRetsListingProvider } from "@/services/listings/simplyrets-provider";
import { TrestleListingProvider } from "@/services/listings/trestle-provider";
import type {
  ListingProvider,
  MlsProviderId,
  NeighborhoodService,
  PropertyDetailsService,
  SearchService,
} from "@/services/listings/types";

export type {
  ListingProvider,
  MlsProviderId,
  NeighborhoodService,
  PropertyDetailsService,
  SearchService,
} from "@/services/listings/types";

export { MockListingProvider } from "@/services/listings/mock-provider";
export { RealtyAPIListingProvider } from "@/services/listings/realty-api-provider";

let cachedProvider: ListingProvider | null = null;

export function getListingProvider(providerId?: MlsProviderId): ListingProvider {
  if (cachedProvider && !providerId) return cachedProvider;

  const id = (providerId ??
    (process.env.MLS_PROVIDER as MlsProviderId | undefined) ??
    (siteConfig.integrations.mls.provider as MlsProviderId) ??
    "mock") as MlsProviderId;

  let provider: ListingProvider;
  switch (id) {
    case "realtyapi":
      provider = new RealtyAPIListingProvider();
      break;
    case "bridge":
      provider = new BridgeListingProvider();
      break;
    case "idx":
      provider = new IdxListingProvider();
      break;
    case "mls-grid":
      provider = new MlsGridListingProvider();
      break;
    case "simplyrets":
      provider = new SimplyRetsListingProvider();
      break;
    case "trestle":
      provider = new TrestleListingProvider();
      break;
    case "estated":
      provider = new EstatedListingProvider();
      break;
    case "reso":
      provider = new ResoListingProvider();
      break;
    case "mock":
    default:
      provider = new MockListingProvider();
      break;
  }

  if (!providerId) cachedProvider = provider;
  return provider;
}

export class SearchServiceImpl implements SearchService {
  constructor(private readonly provider: ListingProvider = getListingProvider()) {}

  search(filters: SearchFilters): Promise<SearchResult> {
    return this.provider.search(filters);
  }

  async suggest(query: string): Promise<
    { type: "city" | "zip" | "address" | "neighborhood" | "mls"; value: string }[]
  > {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const suggestions: {
      type: "city" | "zip" | "address" | "neighborhood" | "mls";
      value: string;
    }[] = [];

    const cities = [
      ...new Set(mockNeighborhoods.map((n) => n.name)),
    ];
    for (const city of cities) {
      if (city.toLowerCase().includes(q)) {
        suggestions.push({ type: "city", value: city });
      }
    }

    for (const n of mockNeighborhoods) {
      if (n.name.toLowerCase().includes(q) || n.slug.includes(q)) {
        suggestions.push({ type: "neighborhood", value: n.name });
      }
    }

    if (/^\d{3,5}$/.test(q)) {
      const result = await this.provider.search({ query: q, pageSize: 5 });
      for (const item of result.items) {
        if (item.address.zip.startsWith(q)) {
          suggestions.push({ type: "zip", value: item.address.zip });
        }
      }
    }

    if (q.startsWith("ml") || /\d{5,}/.test(q)) {
      const byMls = await this.provider.getByMlsNumber(query.trim());
      if (byMls) suggestions.push({ type: "mls", value: byMls.mlsNumber });
    }

    const addressHits = await this.provider.search({ query: q, pageSize: 5 });
    for (const item of addressHits.items) {
      suggestions.push({
        type: "address",
        value: `${item.address.street}, ${item.address.city}`,
      });
    }

    const seen = new Set<string>();
    return suggestions.filter((s) => {
      const key = `${s.type}:${s.value}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 10);
  }
}

export class NeighborhoodServiceImpl implements NeighborhoodService {
  async list(): Promise<NeighborhoodSummary[]> {
    return mockNeighborhoods;
  }

  async getBySlug(slug: string): Promise<NeighborhoodSummary | null> {
    return mockNeighborhoods.find((n) => n.slug === slug) ?? null;
  }
}

export class PropertyDetailsServiceImpl implements PropertyDetailsService {
  constructor(private readonly provider: ListingProvider = getListingProvider()) {}

  getDetails(id: string): Promise<ListingDetails | null> {
    return this.provider.getById(id);
  }

  async getNearbySchools(id: string): Promise<ListingDetails["schools"]> {
    const detail = await this.provider.getById(id);
    return detail?.schools ?? [];
  }

  async getScores(id: string): Promise<ListingDetails["scores"]> {
    const detail = await this.provider.getById(id);
    return detail?.scores ?? {};
  }

  async getPhotos(id: string): Promise<ListingDetails["photos"]> {
    const detail = await this.provider.getById(id);
    return detail?.photos ?? [];
  }

  async getHistory(id: string): Promise<{
    priceHistory: ListingDetails["priceHistory"];
    taxHistory: ListingDetails["taxHistory"];
    propertyHistory: ListingDetails["propertyHistory"];
  }> {
    const detail = await this.provider.getById(id);
    return {
      priceHistory: detail?.priceHistory ?? [],
      taxHistory: detail?.taxHistory ?? [],
      propertyHistory: detail?.propertyHistory ?? [],
    };
  }

  async getMapMarkers(filters: SearchFilters): Promise<
    { id: string; lat: number; lng: number; price: number; slug: string }[]
  > {
    const result = await this.provider.search({ ...filters, pageSize: filters.pageSize ?? 200 });
    return result.items.map((item) => ({
      id: item.id,
      lat: item.geo.lat,
      lng: item.geo.lng,
      price: item.listPrice,
      slug: item.slug,
    }));
  }
}
