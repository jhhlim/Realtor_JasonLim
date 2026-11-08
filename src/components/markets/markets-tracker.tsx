"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ExternalLink, TrendingDown, TrendingUp } from "lucide-react";

import type { MarketQuote, MarketsSnapshot } from "@/services/markets/types";
import { formatMarketChange, formatMarketPrice } from "@/lib/markets-format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkline } from "@/components/markets/sparkline";

function QuoteCard({ quote }: { quote: MarketQuote }) {
  const { changeLabel, pctLabel, direction } = formatMarketChange(
    quote.change,
    quote.changePct,
  );
  const up = direction === "up";
  const down = direction === "down";

  return (
    <Card className="border-border/80 shadow-soft">
      <CardHeader className="space-y-2 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {quote.shortName}
            </p>
            <CardTitle className="mt-1 text-lg">{quote.name}</CardTitle>
          </div>
          <Badge variant="outline" className="shrink-0 text-[10px]">
            {quote.symbol}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-display text-2xl font-semibold tracking-tight">
              {formatMarketPrice(quote.price, quote.id)}
              {quote.unit ? (
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  {quote.unit}
                </span>
              ) : null}
            </p>
            <p
              className={`mt-1 inline-flex items-center gap-1 text-sm font-medium ${
                up
                  ? "text-emerald-600 dark:text-emerald-400"
                  : down
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-muted-foreground"
              }`}
            >
              {up ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : down ? (
                <TrendingDown className="h-3.5 w-3.5" />
              ) : null}
              {changeLabel} ({pctLabel})
            </p>
          </div>
          <div className="w-28 shrink-0">
            <Sparkline data={quote.history.slice(-20)} positive={!down} />
          </div>
        </div>
        <Link
          href={quote.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-accent"
        >
          Track on {quote.sourceUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          <ExternalLink className="h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}

function HistoryChart({ quote }: { quote: MarketQuote }) {
  const data = useMemo(
    () =>
      quote.history.map((point) => ({
        ...point,
        label: point.date.slice(5),
      })),
    [quote.history],
  );

  if (data.length < 2) return null;

  return (
    <Card className="border-border/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          {quote.shortName} — ~1 month daily closes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                minTickGap={24}
                stroke="var(--muted-foreground)"
              />
              <YAxis
                domain={["auto", "auto"]}
                width={64}
                tick={{ fontSize: 11 }}
                stroke="var(--muted-foreground)"
                tickFormatter={(v: number) =>
                  quote.id === "oil" || quote.id === "gold"
                    ? `$${Number(v).toFixed(0)}`
                    : Number(v).toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })
                }
              />
              <Tooltip
                formatter={(value) => [
                  formatMarketPrice(Number(value ?? 0), quote.id),
                  "Close",
                ]}
                labelFormatter={(label) => `Date ${String(label)}`}
              />
              <Line
                type="monotone"
                dataKey="close"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function MarketsTracker({ snapshot }: { snapshot: MarketsSnapshot }) {
  if (!snapshot.quotes.length) {
    return (
      <Card className="border-dashed border-border/80">
        <CardContent className="space-y-3 p-6 text-sm text-muted-foreground">
          <p>Live quotes are temporarily unavailable.</p>
          <p>
            Check{" "}
            <Link
              href="https://oilprice.com/"
              className="text-accent underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OilPrice.com
            </Link>
            ,{" "}
            <Link
              href="https://goldprice.org/"
              className="text-accent underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GoldPrice.org
            </Link>
            , and{" "}
            <Link
              href="https://www.cnbc.com/"
              className="text-accent underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CNBC
            </Link>{" "}
            for the latest prints — then refresh this page.
          </p>
        </CardContent>
      </Card>
    );
  }

  const asOfLabel = new Date(snapshot.asOf).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>
          Updated {asOfLabel} · Source: {snapshot.provider}
        </p>
        <p className="text-xs">Auto-refreshes about hourly (daily track).</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {snapshot.quotes.map((quote) => (
          <QuoteCard key={quote.id} quote={quote} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {snapshot.quotes.map((quote) => (
          <HistoryChart key={`${quote.id}-chart`} quote={quote} />
        ))}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
        {snapshot.disclaimer} Reference sites:{" "}
        <Link
          href="https://oilprice.com/"
          className="underline-offset-2 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          oilprice.com
        </Link>
        ,{" "}
        <Link
          href="https://goldprice.org/"
          className="underline-offset-2 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          goldprice.org
        </Link>
        ,{" "}
        <Link
          href="https://www.cnbc.com/"
          className="underline-offset-2 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          cnbc.com
        </Link>
        .
      </p>
    </div>
  );
}
