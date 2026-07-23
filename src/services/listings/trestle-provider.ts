import type { ListingDetails, ListingSummary, SearchFilters, SearchResult } from "@/types";
import type { ListingProvider } from "@/services/listings/types";

/**
 * Trestle (CoreLogic) RESO adapter stub.
 * Configure TRESTLE_CLIENT_ID / TRESTLE_CLIENT_SECRET when ready.
 */
export class TrestleListingProvider implements ListingProvider {
  readonly name = "trestle";

  private notConfigured(): never {
    throw new Error(
      "Not configured: set TRESTLE_CLIENT_ID and TRESTLE_CLIENT_SECRET for TrestleListingProvider",
    );
  }

  async search(_filters: SearchFilters): Promise<SearchResult> {
    this.notConfigured();
  }

  async getById(_id: string): Promise<ListingDetails | null> {
    this.notConfigured();
  }

  async getByMlsNumber(_mlsNumber: string): Promise<ListingDetails | null> {
    this.notConfigured();
  }

  async getFeatured(_limit?: number): Promise<ListingSummary[]> {
    this.notConfigured();
  }

  async getRecentSales(_limit?: number): Promise<ListingSummary[]> {
    this.notConfigured();
  }
}
