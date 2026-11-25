import Link from "next/link";
import { ArrowRight, Clapperboard } from "lucide-react";

import { FadeIn } from "@/components/shared/fade-in";
import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function SellerToolkitTeaser() {
  return (
    <Section
      eyebrow="For sellers"
      title="Beyond the listing"
      description="Video marketing, listing websites, staging pieces, contractor referrals, prep help — plus listing concierge and occupied-home support when you need it."
      className="bg-gradient-to-b from-slate-soft/80 to-background dark:from-card/30"
      actions={
        <Button asChild variant="outline">
          <Link href="/sell#seller-toolkit">
            Seller toolkit
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      }
    >
      <FadeIn>
        <Card className="overflow-hidden border-border/70 shadow-soft">
          <CardContent className="grid gap-6 p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-8 sm:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/25 bg-accent/10 text-accent">
              <Clapperboard className="h-7 w-7" aria-hidden />
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                Watch the YouTube pitch, then see the full seller toolkit
              </h3>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
                Marketing video, AI-assisted listing sites, staging, contractor
                referrals, and handyman support — plus listing concierge, housing
                logistics, and tenant-aware showings on the Sell page.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 sm:justify-end">
              <Button asChild variant="accent">
                <Link href="/sell#seller-toolkit">See seller toolkit</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/sell#listing-support">Listing support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </Section>
  );
}
