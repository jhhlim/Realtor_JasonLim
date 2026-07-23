import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/shared/fade-in";
import { Badge } from "@/components/ui/badge";
import { NeighborhoodServiceImpl } from "@/services/listings";
import { buildMetadata } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Communities",
  description:
    "Explore Bay Area neighborhoods — median prices, market trends, schools, and lifestyle across Silicon Valley cities.",
  path: "/communities",
});

export default async function CommunitiesPage() {
  const neighborhoods = [...(await new NeighborhoodServiceImpl().list())].sort(
    (a, b) => a.name.localeCompare(b.name),
  );

  return (
    <>
      <PageHero
        eyebrow="Communities"
        title="Bay Area neighborhoods"
        description="Compare median prices, year-over-year trends, and local character across Silicon Valley — from San Jose to Palo Alto."
        primaryCta={{ label: "Search homes", href: "/listings" }}
        secondaryCta={{
          label: "Market reports",
          href: "/market-reports",
        }}
      />

      <Section className="pt-10 sm:pt-12">
        {neighborhoods.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-secondary/40 px-6 py-16 text-center text-muted-foreground">
            Community guides are being prepared. Check back soon.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {neighborhoods.map((hood, index) => (
              <FadeIn key={hood.slug} delay={index * 0.04}>
                <Link
                  href={`/communities/${hood.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                    <Image
                      src={hood.heroImage}
                      alt={hood.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F33]/70 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h2 className="font-display text-xl font-semibold text-white">
                        {hood.name}
                      </h2>
                      <p className="text-sm text-white/80 line-clamp-2">
                        {hood.tagline}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-3 p-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Median price
                      </p>
                      <p className="font-medium">
                        {formatCurrency(hood.medianPrice)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        hood.priceChangeYoY >= 0 ? "accent" : "secondary"
                      }
                    >
                      {hood.priceChangeYoY >= 0 ? "+" : ""}
                      {hood.priceChangeYoY.toFixed(1)}% YoY
                    </Badge>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
