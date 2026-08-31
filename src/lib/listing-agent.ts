import type { ListingSummary } from "@/types";

/** Format MLS listing agent + office for cards and detail pages. */
export function formatListingAttribution(
  listing: Pick<ListingSummary, "listingAgentName" | "listingOffice">,
): string {
  const agent = listing.listingAgentName?.trim();
  const office = listing.listingOffice?.trim();

  if (agent && office) return `Listed by ${agent} · ${office}`;
  if (agent) return `Listed by ${agent}`;
  if (office) return `Listed by ${office}`;
  return "Listing agent info unavailable";
}
