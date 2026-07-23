import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { NeighborhoodSummary } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/shared/fade-in";
import { formatCurrency, formatCompact } from "@/lib/utils";

interface NeighborhoodsPreviewProps {
  neighborhoods?: NeighborhoodSummary[];
}

export function NeighborhoodsPreview({
  neighborhoods = [],
}: NeighborhoodsPreviewProps) {
  return (
    <Section
      eyebrow="Communities"
      title="Neighborhoods worth knowing"
      description="From San Jose to Palo Alto — lifestyle, schools, and pricing context in one place."
    >
      {neighborhoods.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {neighborhoods.slice(0, 6).map((hood, index) => (
            <FadeIn key={hood.slug} delay={index * 0.05}>
              <Link
                href={`/communities/${hood.slug}`}
                className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
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
                    <h3 className="font-display text-xl font-semibold text-white">
                      {hood.name}
                    </h3>
                    <p className="text-sm text-white/80">{hood.tagline}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Median price</p>
                    <p className="font-medium">{formatCurrency(hood.medianPrice)}</p>
                  </div>
                  <Badge
                    variant={hood.priceChangeYoY >= 0 ? "accent" : "secondary"}
                  >
                    {hood.priceChangeYoY >= 0 ? "+" : ""}
                    {hood.priceChangeYoY.toFixed(1)}% YoY
                  </Badge>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "San Jose",
            "Cupertino",
            "Palo Alto",
            "Sunnyvale",
            "Los Gatos",
            "Fremont",
          ].map((name, index) => (
            <FadeIn key={name} delay={index * 0.04}>
              <Link
                href={`/communities/${name.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 transition-colors hover:border-accent/40"
              >
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="text-sm text-muted-foreground">
                    Explore local market
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-accent" />
              </Link>
            </FadeIn>
          ))}
        </div>
      )}
      {!neighborhoods.length ? null : (
        <p className="mt-6 text-sm text-muted-foreground">
          Avg DOM often near {formatCompact(neighborhoods[0]?.avgDom ?? 18)} days
          depending on segment and season.
        </p>
      )}
    </Section>
  );
}
