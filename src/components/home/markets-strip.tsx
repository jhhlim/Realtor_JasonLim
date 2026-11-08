import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { TradingViewTickers } from "@/components/markets/tradingview-tickers";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/shared/fade-in";

/** Always visible — tickers render in the browser via TradingView. */
export function MarketsStrip() {
  return (
    <Section
      eyebrow="Markets desk"
      title="Oil, gold & major indexes — daily track"
      description="Live macro prints that shape rates, risk appetite, and Bay Area buyer psychology. Oil · Gold · S&P 500 · Dow · Nasdaq."
      className="bg-gradient-to-b from-background to-slate-soft/60 dark:to-card/20"
    >
      <FadeIn>
        <TradingViewTickers />

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button asChild variant="accent">
            <Link href="/tools/markets">
              Open daily tracker & charts
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
