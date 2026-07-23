import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  GraduationCap,
  MapPin,
  Play,
  Sparkles,
  TreePine,
  UtensilsCrossed,
} from "lucide-react";

import { ListingGrid } from "@/components/listings/listing-grid";
import { PropertyMapDynamic } from "@/components/map/property-map-dynamic";
import { Container } from "@/components/shared/container";
import { CtaBanner } from "@/components/shared/cta-banner";
import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/shared/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { mockNeighborhoods } from "@/data/mock-neighborhoods";
import { MarketTrendChart } from "@/features/communities/market-trend-chart";
import {
  getListingProvider,
  NeighborhoodServiceImpl,
} from "@/services/listings";
import { buildMetadata } from "@/lib/seo";
import { formatCurrency, formatNumber } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const neighborhoods = await new NeighborhoodServiceImpl().list();
  return neighborhoods.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const neighborhood = await new NeighborhoodServiceImpl().getBySlug(slug);
  if (!neighborhood)
    return buildMetadata({ title: "Community Not Found", noIndex: true });

  return buildMetadata({
    title: `${neighborhood.name} Real Estate`,
    description: `${neighborhood.tagline} Median home price ${formatCurrency(neighborhood.medianPrice)}. Schools, lifestyle, restaurants, and market trends for ${neighborhood.name}, ${neighborhood.county} County.`,
    path: `/communities/${slug}`,
    image: neighborhood.heroImage,
    keywords: [
      `${neighborhood.name} homes`,
      `${neighborhood.name} real estate`,
      `${neighborhood.name} schools`,
      "Bay Area realtor",
      siteConfig.name,
    ],
  });
}

export default async function CommunityPage({ params }: PageProps) {
  const { slug } = await params;
  const neighborhood =
    (await new NeighborhoodServiceImpl().getBySlug(slug)) ??
    mockNeighborhoods.find((n) => n.slug === slug);
  if (!neighborhood) notFound();

  const listingsHref = `/listings?city=${encodeURIComponent(neighborhood.name)}`;
  const listingsResult = await getListingProvider().search({
    city: neighborhood.name,
    pageSize: 6,
    status: ["active", "coming_soon", "pending"],
  });

  return (
    <>
      <section className="relative border-b border-border/70">
        <div className="relative aspect-[21/9] min-h-[280px] w-full overflow-hidden bg-secondary sm:min-h-[360px]">
          <Image
            src={neighborhood.heroImage}
            alt={`${neighborhood.name} neighborhood`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F33]/90 via-[#0B1F33]/40 to-transparent" />
          <Container className="absolute inset-x-0 bottom-0 pb-10 pt-24 sm:pb-14">
            <FadeIn>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {neighborhood.county} County
              </p>
              <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {neighborhood.name}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
                {neighborhood.tagline}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="accent" size="lg">
                  <Link href={listingsHref}>
                    Search homes in {neighborhood.name}
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/35 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                >
                  <Link href={siteConfig.cta.consultation.href}>
                    {siteConfig.cta.consultation.label}
                  </Link>
                </Button>
              </div>
            </FadeIn>
          </Container>
        </div>
      </section>

      <Section className="pt-10 sm:pt-12">
        <FadeIn>
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {neighborhood.description}
          </p>
        </FadeIn>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Median price",
              value: formatCurrency(neighborhood.medianPrice),
            },
            {
              label: "YoY change",
              value: `${neighborhood.priceChangeYoY >= 0 ? "+" : ""}${neighborhood.priceChangeYoY.toFixed(1)}%`,
            },
            {
              label: "Avg days on market",
              value: `${neighborhood.avgDom} days`,
            },
          ].map((stat, index) => (
            <FadeIn key={stat.label} delay={index * 0.05}>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>{stat.label}</CardDescription>
                  <CardTitle className="text-2xl">{stat.value}</CardTitle>
                </CardHeader>
              </Card>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.1} className="mt-8">
          <PropertyMapDynamic
            markers={[
              {
                id: neighborhood.slug,
                lat: neighborhood.geo.lat,
                lng: neighborhood.geo.lng,
                label: neighborhood.name,
              },
            ]}
            center={[neighborhood.geo.lat, neighborhood.geo.lng]}
            zoom={12}
            height={280}
          />
        </FadeIn>
      </Section>

      <Section className="bg-secondary/40">
        <FadeIn>
          <div className="mb-8 flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-accent" />
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Schools
            </h2>
          </div>
          <p className="max-w-3xl text-muted-foreground">
            {neighborhood.schoolsHighlight}
          </p>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <div className="mb-8 flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-accent" />
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Lifestyle
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {neighborhood.lifestyle.map((item) => (
              <Badge key={item} variant="secondary" className="px-3 py-1.5">
                {item}
              </Badge>
            ))}
          </div>
        </FadeIn>
      </Section>

      <Section className="bg-secondary/40">
        <FadeIn>
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Home prices & market trends
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Twelve-month median price trend for {neighborhood.name} — useful
            context before you tour or write an offer.
          </p>
        </FadeIn>
        <FadeIn delay={0.08} className="mt-8">
          <Card className="p-6">
            <MarketTrendChart data={neighborhood.marketTrend} />
          </Card>
        </FadeIn>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <FadeIn>
            <div className="mb-6 flex items-center gap-3">
              <UtensilsCrossed className="h-6 w-6 text-accent" />
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                Restaurants
              </h2>
            </div>
            <ul className="space-y-3">
              {neighborhood.restaurants.map((name) => (
                <li
                  key={name}
                  className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-accent" />
                  {name}
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.06}>
            <div className="mb-6 flex items-center gap-3">
              <TreePine className="h-6 w-6 text-accent" />
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                Parks & outdoors
              </h2>
            </div>
            <ul className="space-y-3">
              {neighborhood.parks.map((name) => (
                <li
                  key={name}
                  className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm"
                >
                  <TreePine className="h-4 w-4 shrink-0 text-accent" />
                  {name}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </Section>

      <Section className="bg-secondary/40">
        <FadeIn>
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Neighborhood video
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            A guided walkthrough of {neighborhood.name} — coming soon.
          </p>
        </FadeIn>
        <FadeIn delay={0.06} className="mt-8">
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-card">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
            <div className="relative flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-secondary">
                <Play className="h-7 w-7 text-accent" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold">
                  Video tour placeholder
                </p>
                <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Street-level preview & market commentary
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Homes in {neighborhood.name}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {listingsResult.total
                  ? `${formatNumber(listingsResult.total)} listing${listingsResult.total === 1 ? "" : "s"} in this city`
                  : "No active listings in mock data for this city yet"}
              </p>
            </div>
            <Button asChild variant="accent">
              <Link href={listingsHref}>View all</Link>
            </Button>
          </div>
        </FadeIn>
        <ListingGrid
          listings={listingsResult.items}
          emptyMessage={`No current listings for ${neighborhood.name}. Try nearby cities or widen your search.`}
        />
      </Section>

      <CtaBanner
        title={`Ready to explore ${neighborhood.name}?`}
        description={`Browse active listings in ${neighborhood.name} or schedule a consultation to build a neighborhood-specific buying or selling strategy.`}
        primaryLabel={`Search ${neighborhood.name} homes`}
        primaryHref={listingsHref}
        secondaryLabel={siteConfig.cta.consultation.label}
        secondaryHref={siteConfig.cta.consultation.href}
      />

      <Section className="pb-16 pt-0 sm:pb-20">
        <FadeIn>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/communities">All communities</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/market-reports">Market reports</Link>
            </Button>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}
