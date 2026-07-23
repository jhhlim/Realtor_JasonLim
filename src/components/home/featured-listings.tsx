import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { ListingSummary } from "@/types";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { ListingGrid } from "@/components/listings/listing-grid";
import { Section } from "@/components/shared/section";

interface FeaturedListingsProps {
  listings?: ListingSummary[];
}

export function FeaturedListings({ listings = [] }: FeaturedListingsProps) {
  return (
    <Section
      eyebrow="Featured homes"
      title="Curated listings across Silicon Valley"
      description="A focused selection of active opportunities — updated as inventory moves."
      actions={
        <Button asChild variant="outline">
          <Link href={siteConfig.cta.search.href}>
            View all listings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      }
    >
      <ListingGrid
        listings={listings}
        emptyMessage="Featured listings will appear here once connected to MLS data."
      />
    </Section>
  );
}
