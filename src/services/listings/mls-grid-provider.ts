import type { ListingDetails, ListingSummary, SearchFilters, SearchResult } from "@/types";
import type { ListingProvider } from "@/services/listings/types";

/**
 * MLS Grid adapter stub (RESO Web API over MLS Grid).
 * Configure MLS_GRID_ACCESS_TOKEN / MLS_GRID_ORIGINATING_SYSTEM when ready.
 */
export class MlsGridListingProvider implements ListingProvider {
  readonly name = "mls-grid";

  private notConfigured(): never {
    throw new Error(
      "Not configured: set MLS_GRID_ACCESS_TOKEN and MLS_GRID_ORIGINATING_SYSTEM for MlsGridListingProvider",
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
