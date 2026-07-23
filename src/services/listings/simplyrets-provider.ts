import type { ListingDetails, ListingSummary, SearchFilters, SearchResult } from "@/types";
import type { ListingProvider } from "@/services/listings/types";

/**
 * SimplyRETS adapter stub.
 * Configure SIMPLYRETS_USERNAME / SIMPLYRETS_PASSWORD when ready.
 */
export class SimplyRetsListingProvider implements ListingProvider {
  readonly name = "simplyrets";

  private notConfigured(): never {
    throw new Error(
      "Not configured: set SIMPLYRETS_USERNAME and SIMPLYRETS_PASSWORD for SimplyRetsListingProvider",
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
