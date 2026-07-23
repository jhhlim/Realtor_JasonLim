import type { ListingDetails } from "@/types";
import { getListingProvider } from "@/services/listings";
import { mockListings } from "@/data/mock-listings";

export async function getListingBySlug(
  slug: string,
): Promise<ListingDetails | null> {
  const provider = getListingProvider();
  const result = await provider.search({ pageSize: 200 });
  const summary = result.items.find((item) => item.slug === slug);
  if (summary) {
    const detail = await provider.getById(summary.id);
    if (detail) return detail;
  }

  // Fallback for mock / incomplete providers that omit details from search.
  return mockListings.find((listing) => listing.slug === slug) ?? null;
}
