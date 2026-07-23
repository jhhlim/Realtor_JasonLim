import type { ListingDetails, ListingSummary, SearchFilters, SearchResult } from "@/types";
import type { ListingProvider } from "@/services/listings/types";

/**
 * Generic IDX (Internet Data Exchange) feed adapter stub.
 * Configure IDX_API_KEY / IDX_FEED_URL when your brokerage IDX vendor is connected.
 */
export class IdxListingProvider implements ListingProvider {
  readonly name = "idx";

  private notConfigured(): never {
    throw new Error("Not configured: set IDX_API_KEY and IDX_FEED_URL for IdxListingProvider");
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
