import type { ListingDetails, ListingSummary, SearchFilters, SearchResult } from "@/types";
import type { ListingProvider } from "@/services/listings/types";

/**
 * Generic RESO Web API adapter stub.
 * Configure RESO_API_BASE_URL / RESO_ACCESS_TOKEN when connecting to a RESO-compliant MLS.
 */
export class ResoListingProvider implements ListingProvider {
  readonly name = "reso";

  private notConfigured(): never {
    throw new Error(
      "Not configured: set RESO_API_BASE_URL and RESO_ACCESS_TOKEN for ResoListingProvider",
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
