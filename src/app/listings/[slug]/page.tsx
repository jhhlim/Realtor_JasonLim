import type { Metadata } from "next";
import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Bath,
  BedDouble,
  Bike,
  Bus,
  Calendar,
  ExternalLink,
  Footprints,
  Maximize2,
  MapPin,
} from "lucide-react";

import { getListingProvider } from "@/services/listings";
import { siteConfig } from "@/config/site";
import { PropertyGallery } from "@/components/listings/property-gallery";
import { MortgageEstimate } from "@/components/listings/mortgage-estimate";
import { ListingGrid } from "@/components/listings/listing-grid";
import { PropertyMapDynamic } from "@/components/map/property-map-dynamic";
import { FavoriteButton } from "@/features/listings/favorite-button";
import { ShareButton } from "@/features/listings/share-button";
import { RequestInfoForm } from "@/features/listings/request-info-form";
import { Container } from "@/components/shared/container";
import { CtaBanner } from "@/components/shared/cta-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getListingBySlug } from "@/lib/get-listing-by-slug";
import { listingJsonLd } from "@/lib/listing-json-ld";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { ListingDetails } from "@/types";

const statusLabels: Record<ListingDetails["status"], string> = {
  active: "Active",
  pending: "Pending",
  sold: "Sold",
  coming_soon: "Coming Soon",
  withdrawn: "Withdrawn",
};

const propertyTypeLabels: Record<ListingDetails["propertyType"], string> = {
  single_family: "Single Family",
  condo: "Condo",
  townhome: "Townhome",
  multi_family: "Multi-Family",
  land: "Land",
  other: "Other",
};

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const provider = getListingProvider();
  const featured = await provider.getFeatured(20);
  return featured.map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) {
    return { title: `Listing not found | ${siteConfig.name}` };
  }

  const addressLine = [
    listing.address.street,
    listing.address.unit ? `#${listing.address.unit}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const title = `${addressLine}, ${listing.address.city} | ${formatCurrency(listing.listPrice)}`;
  const description =
    listing.description.slice(0, 155) +
    (listing.description.length > 155 ? "…" : "");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: listing.photo }],
      type: "article",
    },
  };
}

function ScorePill({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: number;
  icon: ComponentType<{ className?: string }>;
}) {
  if (value == null) return null;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-soft text-accent dark:bg-secondary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        <p className="font-display text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

export default async function ListingDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const addressLine = [
    listing.address.street,
    listing.address.unit ? `#${listing.address.unit}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const fullAddress = `${addressLine}, ${listing.address.city}, ${listing.address.state} ${listing.address.zip}`;

  const related = await getListingProvider().search({
    city: listing.address.city,
    pageSize: 4,
  });
  const relatedListings = related.items.filter((item) => item.id !== listing.id).slice(0, 3);

  const jsonLd = listingJsonLd(listing);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-border/70 bg-gradient-to-b from-slate-soft to-background py-8 sm:py-10 dark:from-card/40">
        <Container>
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/listings" className="hover:text-foreground">
              Listings
            </Link>
            <span>/</span>
            <Link
              href={`/listings?city=${encodeURIComponent(listing.address.city)}`}
              className="hover:text-foreground"
            >
              {listing.address.city}
            </Link>
            <span>/</span>
            <span className="text-foreground">{addressLine}</span>
          </div>

          <PropertyGallery photos={listing.photos} alt={fullAddress} />

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={listing.status === "sold" ? "secondary" : "accent"}
                  >
                    {statusLabels[listing.status]}
                  </Badge>
                  <Badge variant="secondary">
                    {propertyTypeLabels[listing.propertyType]}
                  </Badge>
                  {listing.featured ? <Badge>Featured</Badge> : null}
                  {listing.priceReduced ? (
                    <Badge variant="warning">Price Reduced</Badge>
                  ) : null}
                  {listing.openHouse ? (
                    <Badge variant="success">Open House</Badge>
                  ) : null}
                  {listing.newConstruction ? (
                    <Badge variant="secondary">New Construction</Badge>
                  ) : null}
                </div>

                <p className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                  {formatCurrency(listing.listPrice)}
                </p>
                {listing.estimatedValue ? (
                  <p className="text-sm text-muted-foreground">
                    Estimated value {formatCurrency(listing.estimatedValue)}
                  </p>
                ) : null}

                <div>
                  <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                    {addressLine}
                  </h1>
                  <p className="mt-1 flex items-start gap-2 text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {listing.address.city}, {listing.address.state}{" "}
                    {listing.address.zip}
                    {listing.address.neighborhood
                      ? ` · ${listing.address.neighborhood}`
                      : ""}
                  </p>
                </div>

                <div className="flex flex-wrap gap-5 text-sm sm:text-base">
                  <span className="inline-flex items-center gap-2">
                    <BedDouble className="h-5 w-5 text-accent" />
                    {listing.beds} beds
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Bath className="h-5 w-5 text-accent" />
                    {listing.baths} baths
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Maximize2 className="h-5 w-5 text-accent" />
                    {formatNumber(listing.sqft)} sqft
                  </span>
                  {listing.lotSizeSqft ? (
                    <span className="text-muted-foreground">
                      Lot {formatNumber(listing.lotSizeSqft)} sqft
                    </span>
                  ) : null}
                  {listing.yearBuilt ? (
                    <span className="text-muted-foreground">
                      Built {listing.yearBuilt}
                    </span>
                  ) : null}
                </div>

                <p className="text-sm text-muted-foreground">
                  MLS {listing.mlsNumber}
                  {listing.daysOnMarket != null
                    ? ` · ${listing.daysOnMarket} days on market`
                    : ""}
                  {listing.hoaMonthly
                    ? ` · HOA ${formatCurrency(listing.hoaMonthly)}/mo`
                    : ""}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild variant="accent" size="lg">
                  <Link href={siteConfig.calendly} target="_blank" rel="noreferrer">
                    <Calendar className="h-4 w-4" />
                    Schedule showing
                  </Link>
                </Button>
                <RequestInfoForm
                  listingAddress={fullAddress}
                  listingSlug={listing.slug}
                  mlsNumber={listing.mlsNumber}
                  triggerVariant="outline"
                />
                <ShareButton
                  title={`${addressLine} — ${formatCurrency(listing.listPrice)}`}
                  text={listing.description.slice(0, 120)}
                />
                <FavoriteButton listingId={listing.id} />
              </div>

              <Separator />

              <div className="space-y-3">
                <h2 className="font-display text-2xl font-semibold">About this home</h2>
                <p className="leading-relaxed text-muted-foreground text-pretty">
                  {listing.description}
                </p>
              </div>

              {listing.features.length ? (
                <div className="space-y-3">
                  <h2 className="font-display text-2xl font-semibold">Features</h2>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {listing.features.map((feature) => (
                      <li
                        key={feature}
                        className="rounded-xl border border-border/80 bg-card px-4 py-3 text-sm"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="space-y-3">
                <h2 className="font-display text-2xl font-semibold">Location</h2>
                <PropertyMapDynamic
                  markers={[
                    {
                      id: listing.id,
                      lat: listing.geo.lat,
                      lng: listing.geo.lng,
                      price: listing.listPrice,
                      slug: listing.slug,
                      label: addressLine,
                    },
                  ]}
                  center={[listing.geo.lat, listing.geo.lng]}
                  zoom={15}
                  height={320}
                />
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={
                        listing.streetViewUrl ??
                        `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${listing.geo.lat},${listing.geo.lng}`
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Street View
                    </a>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${listing.geo.lat},${listing.geo.lng}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open in Maps
                    </a>
                  </Button>
                </div>
              </div>

              {(listing.scores.walk != null ||
                listing.scores.transit != null ||
                listing.scores.bike != null) && (
                <div className="space-y-3">
                  <h2 className="font-display text-2xl font-semibold">
                    Walk & transit scores
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <ScorePill
                      label="Walk"
                      value={listing.scores.walk}
                      icon={Footprints}
                    />
                    <ScorePill
                      label="Transit"
                      value={listing.scores.transit}
                      icon={Bus}
                    />
                    <ScorePill
                      label="Bike"
                      value={listing.scores.bike}
                      icon={Bike}
                    />
                  </div>
                </div>
              )}

              {listing.schools.length ? (
                <div className="space-y-3">
                  <h2 className="font-display text-2xl font-semibold">Schools</h2>
                  <div className="overflow-hidden rounded-2xl border border-border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-secondary/60 text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3 font-medium">School</th>
                          <th className="px-4 py-3 font-medium">Type</th>
                          <th className="px-4 py-3 font-medium">Rating</th>
                          <th className="hidden px-4 py-3 font-medium sm:table-cell">
                            Distance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {listing.schools.map((school) => (
                          <tr
                            key={school.name}
                            className="border-t border-border"
                          >
                            <td className="px-4 py-3">
                              <p className="font-medium">{school.name}</p>
                              {school.grades ? (
                                <p className="text-xs text-muted-foreground">
                                  Grades {school.grades}
                                </p>
                              ) : null}
                            </td>
                            <td className="px-4 py-3 capitalize">{school.type}</td>
                            <td className="px-4 py-3">
                              {school.rating != null ? `${school.rating}/10` : "—"}
                            </td>
                            <td className="hidden px-4 py-3 sm:table-cell">
                              {school.distanceMiles != null
                                ? `${school.distanceMiles} mi`
                                : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {listing.priceHistory.length ? (
                <div className="space-y-3">
                  <h2 className="font-display text-2xl font-semibold">
                    Price history
                  </h2>
                  <div className="overflow-hidden rounded-2xl border border-border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-secondary/60 text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3 font-medium">Date</th>
                          <th className="px-4 py-3 font-medium">Event</th>
                          <th className="px-4 py-3 font-medium">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listing.priceHistory.map((item) => (
                          <tr
                            key={`${item.date}-${item.event}`}
                            className="border-t border-border"
                          >
                            <td className="px-4 py-3">{item.date}</td>
                            <td className="px-4 py-3">{item.event}</td>
                            <td className="px-4 py-3">
                              {item.price != null
                                ? formatCurrency(item.price)
                                : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {listing.taxHistory.length ? (
                <div className="space-y-3">
                  <h2 className="font-display text-2xl font-semibold">
                    Tax history
                  </h2>
                  <div className="overflow-hidden rounded-2xl border border-border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-secondary/60 text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3 font-medium">Year</th>
                          <th className="px-4 py-3 font-medium">Tax</th>
                          <th className="px-4 py-3 font-medium">Assessment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listing.taxHistory.map((item) => (
                          <tr key={item.year} className="border-t border-border">
                            <td className="px-4 py-3">{item.year}</td>
                            <td className="px-4 py-3">
                              {formatCurrency(item.amount)}
                            </td>
                            <td className="px-4 py-3">
                              {item.assessment != null
                                ? formatCurrency(item.assessment)
                                : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {listing.comps.length ? (
                <div className="space-y-3">
                  <h2 className="font-display text-2xl font-semibold">
                    Comparable sales
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {listing.comps.map((comp) => (
                      <Card key={comp.id} className="border-border/80">
                        <CardContent className="space-y-2 p-5">
                          <p className="font-medium">{comp.address}</p>
                          <p className="font-display text-xl font-semibold">
                            {formatCurrency(comp.price)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {comp.beds} bd · {comp.baths} ba ·{" "}
                            {formatNumber(comp.sqft)} sqft
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Sold {comp.soldDate} · {comp.distanceMiles} mi away
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : null}

              {listing.propertyHistory.length ? (
                <div className="space-y-3">
                  <h2 className="font-display text-2xl font-semibold">
                    Property notes
                  </h2>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {listing.propertyHistory.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <MortgageEstimate price={listing.listPrice} />

              <Card className="border-border/80 overflow-hidden">
                <div className="relative aspect-[16/10] bg-secondary">
                  <Image
                    src={listing.photo}
                    alt={addressLine}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Work with {siteConfig.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Get a data-backed walkthrough of this property — comps, offer
                    strategy, and neighborhood fit.
                  </p>
                  <Button asChild variant="accent" className="w-full">
                    <Link href={siteConfig.calendly} target="_blank" rel="noreferrer">
                      Schedule showing
                    </Link>
                  </Button>
                  <RequestInfoForm
                    listingAddress={fullAddress}
                    listingSlug={listing.slug}
                    mlsNumber={listing.mlsNumber}
                    triggerVariant="outline"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    {siteConfig.license.dre} · {siteConfig.contact.phone}
                  </p>
                </CardContent>
              </Card>
            </aside>
          </div>
        </Container>
      </section>

      {relatedListings.length ? (
        <section className="py-16 sm:py-20">
          <Container>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  Nearby
                </p>
                <h2 className="font-display text-3xl font-semibold tracking-tight">
                  More in {listing.address.city}
                </h2>
              </div>
              <Button asChild variant="outline">
                <Link
                  href={`/listings?city=${encodeURIComponent(listing.address.city)}`}
                >
                  View all
                </Link>
              </Button>
            </div>
            <ListingGrid listings={relatedListings} />
          </Container>
        </section>
      ) : null}

      <CtaBanner
        title="Want a private showing?"
        description="I'll prepare comps, payment scenarios, and a clear offer plan before you walk through the door."
        primaryLabel="Schedule consultation"
        primaryHref={siteConfig.calendly}
        secondaryLabel="Search more homes"
        secondaryHref="/listings"
      />
    </>
  );
}
