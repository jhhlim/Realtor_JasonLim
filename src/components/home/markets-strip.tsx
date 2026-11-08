import Link from "next/link";
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";

import { getMarketsSnapshot } from "@/services/markets";
import { formatMarketChange, formatMarketPrice } from "@/lib/markets-format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/shared/fade-in";

export async function MarketsStrip() {
  const snapshot = await getMarketsSnapshot();

  if (!snapshot.quotes.length) return null;

  return (
    <Section
      eyebrow="Markets desk"
      title="Oil, gold & major indexes — daily track"
      description="Macro prints that shape rates, risk appetite, and Bay Area buyer psychology. Delayed quotes, refreshed about hourly."
      className="bg-gradient-to-b from-background to-slate-soft/60 dark:to-card/20"
    >
      <FadeIn>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {snapshot.quotes.map((quote) => {
            const { pctLabel, direction } = formatMarketChange(
              quote.change,
              quote.changePct,
            );
            const up = direction === "up";
            const down = direction === "down";
            return (
              <Card
                key={quote.id}
                className="border-border/70 bg-card/90 shadow-soft"
              >
                <CardContent className="space-y-2 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {quote.shortName}
                  </p>
                  <p className="font-display text-xl font-semibold tracking-tight">
                    {formatMarketPrice(quote.price, quote.id)}
                  </p>
                  <p
                    className={`inline-flex items-center gap-1 text-xs font-medium ${
                      up
                        ? "text-emerald-600 dark:text-emerald-400"
                        : down
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-muted-foreground"
                    }`}
                  >
                    {up ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : down ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : null}
                    {pctLabel} today
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button asChild variant="accent">
            <Link href="/tools/markets">
              Open daily tracker
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            Refs:{" "}
            <Link
              href="https://oilprice.com/"
              className="underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OilPrice
            </Link>
            {" · "}
            <Link
              href="https://goldprice.org/"
              className="underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GoldPrice
            </Link>
            {" · "}
            <Link
              href="https://www.cnbc.com/"
              className="underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CNBC
            </Link>
          </p>
        </div>
      </FadeIn>
    </Section>
  );
}
