import type { ListingDetails, ListingSummary, SearchFilters, SearchResult } from "@/types";
import type { ListingProvider } from "@/services/listings/types";

/**
 * Estated property data adapter stub (valuation / public records oriented).
 * Configure ESTATED_API_KEY when ready.
 */
export class EstatedListingProvider implements ListingProvider {
  readonly name = "estated";

  private notConfigured(): never {
    throw new Error("Not configured: set ESTATED_API_KEY for EstatedListingProvider");
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
