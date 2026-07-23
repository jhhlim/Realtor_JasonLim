import type {
  ListingDetails,
  ListingSummary,
  NeighborhoodSummary,
  SearchFilters,
  SearchResult,
} from "@/types";

/**
 * Provider-agnostic MLS / listing contracts.
 * Swap implementations via MLS_PROVIDER without touching UI.
 *
 * Supported adapters (planned / stubbed):
 * - mock
 * - realtyapi
 * - bridge
 * - idx
 * - mls-grid
 * - simplyrets
 * - trestle
 * - estated
 * - reso
 */
export interface ListingProvider {
  readonly name: string;
  search(filters: SearchFilters): Promise<SearchResult>;
  getById(id: string): Promise<ListingDetails | null>;
  getByMlsNumber(mlsNumber: string): Promise<ListingDetails | null>;
  getFeatured(limit?: number): Promise<ListingSummary[]>;
  getRecentSales(limit?: number): Promise<ListingSummary[]>;
}

export interface SearchService {
  search(filters: SearchFilters): Promise<SearchResult>;
  suggest(query: string): Promise<
    { type: "city" | "zip" | "address" | "neighborhood" | "mls"; value: string }[]
  >;
}

export interface NeighborhoodService {
  list(): Promise<NeighborhoodSummary[]>;
  getBySlug(slug: string): Promise<NeighborhoodSummary | null>;
}

export interface PropertyDetailsService {
  getDetails(id: string): Promise<ListingDetails | null>;
  getNearbySchools(id: string): Promise<ListingDetails["schools"]>;
  getScores(id: string): Promise<ListingDetails["scores"]>;
  getPhotos(id: string): Promise<ListingDetails["photos"]>;
  getHistory(id: string): Promise<{
    priceHistory: ListingDetails["priceHistory"];
    taxHistory: ListingDetails["taxHistory"];
    propertyHistory: ListingDetails["propertyHistory"];
  }>;
  getMapMarkers(filters: SearchFilters): Promise<
    { id: string; lat: number; lng: number; price: number; slug: string }[]
  >;
}

export type MlsProviderId =
  | "mock"
  | "realtyapi"
  | "bridge"
  | "idx"
  | "mls-grid"
  | "simplyrets"
  | "trestle"
  | "estated"
  | "reso";
