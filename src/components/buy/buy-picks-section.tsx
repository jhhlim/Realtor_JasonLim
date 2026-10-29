import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bath, BedDouble, CalendarDays, Maximize2 } from "lucide-react";

import type { BuyPick } from "@/data/buy-picks";
import { buyActivePicks, buyPastOpenHouses } from "@/data/buy-picks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/shared/fade-in";
import { formatCurrency, formatNumber } from "@/lib/utils";

function PickCard({ pick, index }: { pick: BuyPick; index: number }) {
  const title = [pick.address, pick.unit ? `#${pick.unit}` : null]
    .filter(Boolean)
    .join(" ");

  return (
    <FadeIn delay={index * 0.04}>
      <Card className="group h-full overflow-hidden border-border/70 transition-all hover:-translate-y-1 hover:shadow-lift">
        <a
          href={pick.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
            <Image
              src={pick.photo}
              alt={`${title}, ${pick.city}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F33]/55 via-transparent to-transparent" />
            <div className="absolute left-3 top-3 z-10 flex max-w-[92%] flex-wrap gap-2">
              {pick.status === "open_house" ? (
                <Badge className="rounded-md border-0 bg-white px-2.5 py-1 font-semibold text-black shadow-md">
                  Open House
                </Badge>
              ) : null}
              {pick.status === "active" ? (
                <Badge className="rounded-md border-0 bg-white px-2.5 py-1 font-semibold text-black shadow-md">
                  Active
                </Badge>
              ) : null}
              {pick.status === "sold" ? (
                <Badge className="rounded-md border-0 bg-black px-2.5 py-1 font-semibold text-white shadow-md">
                  Since sold
                </Badge>
              ) : null}
              {pick.status === "off_market" ? (
                <Badge className="rounded-md border-0 bg-black px-2.5 py-1 font-semibold text-white shadow-md">
                  Off market
                </Badge>
              ) : null}
              {pick.badge ? (
                <Badge className="rounded-md border-0 bg-white px-2.5 py-1 font-semibold text-black shadow-md">
                  {pick.badge}
                </Badge>
              ) : null}
            </div>
            <div className="absolute bottom-3 left-3 right-3 z-10">
              <p className="font-display text-2xl font-semibold text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
                {pick.price
                  ? formatCurrency(pick.price)
                  : pick.priceLabel ?? "See Compass"}
              </p>
            </div>
          </div>
          <CardContent className="space-y-3 p-5">
            <div>
              <h3 className="font-display text-lg font-semibold tracking-tight">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {pick.city}, {pick.state} {pick.zip}
              </p>
            </div>
            {(pick.beds || pick.baths || pick.sqft || pick.openHouse) && (
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                {pick.beds != null ? (
                  <span className="inline-flex items-center gap-1">
                    <BedDouble className="h-3.5 w-3.5" />
                    {pick.beds} bd
                  </span>
                ) : null}
                {pick.baths != null ? (
                  <span className="inline-flex items-center gap-1">
                    <Bath className="h-3.5 w-3.5" />
                    {pick.baths} ba
                  </span>
                ) : null}
                {pick.sqft != null ? (
                  <span className="inline-flex items-center gap-1">
                    <Maximize2 className="h-3.5 w-3.5" />
                    {formatNumber(pick.sqft)} sf
                  </span>
                ) : null}
                {pick.openHouse ? (
                  <span className="inline-flex items-center gap-1 text-accent">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {pick.openHouse}
                  </span>
                ) : null}
              </div>
            )}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {pick.blurb}
            </p>
            <div className="space-y-0.5 text-xs text-muted-foreground">
              <p>
                Listing agent:{" "}
                <span className="font-medium text-foreground">
                  {pick.listingAgent}
                </span>
                {pick.listingAgentDre ? ` · ${pick.listingAgentDre}` : ""}
              </p>
              {pick.roleNote ? <p>{pick.roleNote}</p> : null}
            </div>
            <p className="inline-flex items-center gap-1 text-sm font-medium text-accent">
              View on Compass
              <ArrowUpRight className="h-3.5 w-3.5" />
            </p>
          </CardContent>
        </a>
      </Card>
    </FadeIn>
  );
}

export function BuyPicksSection() {
  return (
    <>
      <Section
        id="featured-homes"
        eyebrow="Featured for buyers"
        title="Open houses & homes I recommend"
        description="Current opportunities I’m hosting or watching closely — tour-ready snapshots with Compass links for full details."
        className="scroll-mt-24"
        actions={
          <Button asChild variant="outline">
            <Link href="/listings">
              Browse all listings
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      >
        <div className="grid gap-6 md:grid-cols-2">
          {buyActivePicks.map((pick, index) => (
            <PickCard key={pick.id} pick={pick} index={index} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Recent open houses"
        title="Open houses I’ve hosted"
        description="Homes where I hosted open houses for fellow Compass agents — including active picks, listings that have since sold, and one that went off market."
        className="bg-gradient-to-b from-slate-soft/70 to-background dark:from-card/25"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {buyPastOpenHouses.map((pick, index) => (
            <PickCard key={pick.id} pick={pick} index={index} />
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Want a private tour or comps for any of these neighborhoods?{" "}
          <Link href="/contact" className="font-medium text-accent hover:underline">
            Let’s connect
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
