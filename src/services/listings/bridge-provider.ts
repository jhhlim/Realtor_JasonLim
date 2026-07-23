import type { ListingDetails, ListingSummary, SearchFilters, SearchResult } from "@/types";
import type { ListingProvider } from "@/services/listings/types";

/**
 * Bridge Interactive (CoreLogic) RESO Web API adapter stub.
 * Configure BRIDGE_CLIENT_ID / BRIDGE_CLIENT_SECRET / BRIDGE_SERVER_TOKEN when ready.
 */
export class BridgeListingProvider implements ListingProvider {
  readonly name = "bridge";

  private notConfigured(): never {
    throw new Error(
      "Not configured: set BRIDGE_CLIENT_ID, BRIDGE_CLIENT_SECRET, and BRIDGE_SERVER_TOKEN for BridgeListingProvider",
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
