import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { ListingSummary } from "@/types";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listings/listing-card";
import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/shared/fade-in";

interface RecentSalesProps {
  listings?: ListingSummary[];
}

export function RecentSales({ listings = [] }: RecentSalesProps) {
  return (
    <Section
      className="bg-slate-soft/60 dark:bg-card/30"
      eyebrow="Recent closings"
      title="Sold results that speak for themselves"
      description="A look at recently closed homes — useful context for pricing and timing strategy."
      actions={
        <Button asChild variant="outline">
          <Link href="/listings?status=sold">
            Browse sold homes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      }
    >
      {listings.length ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing, index) => (
            <FadeIn key={listing.id} delay={index * 0.05}>
              <ListingCard listing={listing} />
            </FadeIn>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-background/70 px-6 py-14 text-center text-muted-foreground">
          Recent sales will populate here from MLS sold data.
        </div>
      )}
    </Section>
  );
}
