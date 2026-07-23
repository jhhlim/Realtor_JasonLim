import type { Metadata } from "next";
import Link from "next/link";

import { getListingProvider } from "@/services/listings";
import { ListingsFiltersClient } from "@/features/listings/listings-filters-client";
import { ListingGrid } from "@/components/listings/listing-grid";
import { PropertyMapDynamic } from "@/components/map/property-map-dynamic";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { parseSearchParams, filtersToSearchParams } from "@/lib/listings-search";
import { formatNumber } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Search Homes | ${siteConfig.name}`,
  description:
    "Browse Bay Area homes for sale — filter by city, price, beds, baths, and more across Silicon Valley communities.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const filters = parseSearchParams(raw);
  const provider = getListingProvider();
  const result = await provider.search(filters);

  const markers = result.items.map((item) => ({
    id: item.id,
    lat: item.geo.lat,
    lng: item.geo.lng,
    price: item.listPrice,
    slug: item.slug,
    label: `${item.address.street}, ${item.address.city}`,
  }));

  const mapCenter: [number, number] | undefined = markers.length
    ? [
        markers.reduce((sum, m) => sum + m.lat, 0) / markers.length,
        markers.reduce((sum, m) => sum + m.lng, 0) / markers.length,
      ]
    : undefined;

  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize));
  const hasFilters = Boolean(
    filters.query ||
      filters.city ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.beds ||
      filters.baths ||
      filters.minSqft ||
      filters.propertyType?.length ||
      filters.openHouse ||
      filters.priceReduced ||
      filters.newConstruction ||
      filters.pool ||
      filters.garage,
  );

  function pageHref(page: number) {
    const params = filtersToSearchParams({ ...filters, page });
    const qs = params.toString();
    return qs ? `/listings?${qs}` : "/listings";
  }

  return (
    <>
      <PageHero
        eyebrow="Listings"
        title="Find your next Bay Area home"
        description="Search active inventory across San Jose, Cupertino, Palo Alto, and neighboring Silicon Valley cities — with filters tuned for real buyers."
      />

      <section className="pb-16 sm:pb-20 lg:pb-24">
        <Container className="pt-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {result.total === 0
                  ? "No homes match"
                  : `${formatNumber(result.total)} home${result.total === 1 ? "" : "s"}`}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {hasFilters
                  ? "Results updated from your filters."
                  : "Showing Bay Area listings — refine with filters anytime."}
                <span className="ml-2 inline-flex">
                  <Badge variant="secondary" className="font-normal">
                    {result.provider}
                  </Badge>
                </span>
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr]">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <ListingsFiltersClient initial={filters} />
            </aside>

            <div className="space-y-8">
              <PropertyMapDynamic
                markers={markers}
                center={mapCenter}
                zoom={markers.length <= 1 ? 13 : 10}
                height={380}
              />

              {result.total === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-secondary/40 px-6 py-16 text-center">
                  <p className="font-display text-xl font-semibold">
                    No listings found
                  </p>
                  <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                    Try widening your price range, removing bed/bath minimums, or
                    searching a nearby city.
                  </p>
                  <Button asChild variant="accent" className="mt-6">
                    <Link href="/listings">Clear all filters</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <ListingGrid
                    listings={result.items}
                    emptyMessage="No listings match your filters yet."
                  />

                  {totalPages > 1 ? (
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {result.page > 1 ? (
                        <Button asChild variant="outline" size="sm">
                          <Link href={pageHref(result.page - 1)}>Previous</Link>
                        </Button>
                      ) : null}
                      <p className="px-3 text-sm text-muted-foreground">
                        Page {result.page} of {totalPages}
                      </p>
                      {result.page < totalPages ? (
                        <Button asChild variant="outline" size="sm">
                          <Link href={pageHref(result.page + 1)}>Next</Link>
                        </Button>
                      ) : null}
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
