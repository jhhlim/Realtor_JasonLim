import { unstable_cache } from "next/cache";

import { fetchStooqQuote } from "./stooq";
import { MARKET_ASSETS, type MarketQuote, type MarketsSnapshot } from "./types";
import { fetchYahooChart } from "./yahoo";

const DISCLAIMER =
  "Delayed market quotes for education only — not investment, tax, or trading advice. Oil, gold, and index levels move with global risk appetite and can influence housing affordability and buyer psychology in Silicon Valley.";

function buildQuote(
  asset: (typeof MARKET_ASSETS)[number],
  price: number,
  previousClose: number,
  history: MarketQuote["history"],
  source: string,
  marketState?: string,
  currency = "USD",
): MarketQuote {
  const change = price - previousClose;
  const changePct = previousClose ? (change / previousClose) * 100 : 0;
  return {
    id: asset.id,
    name: asset.name,
    shortName: asset.shortName,
    symbol: asset.yahoo,
    price,
    previousClose,
    change,
    changePct,
    unit: asset.unit,
    currency,
    marketState,
    updatedAt: new Date().toISOString(),
    source,
    sourceUrl: asset.sourceUrl,
    history,
  };
}

async function fetchAssetQuote(
  asset: (typeof MARKET_ASSETS)[number],
): Promise<MarketQuote | null> {
  try {
    const yahoo = await fetchYahooChart(asset.yahoo);
    if (yahoo) {
      return buildQuote(
        asset,
        yahoo.price,
        yahoo.previousClose,
        yahoo.history,
        `Yahoo Finance · see also ${asset.sourceLabel}`,
        yahoo.marketState,
        yahoo.currency,
      );
    }
  } catch {
    // fall through to Stooq
  }

  try {
    const stooq = await fetchStooqQuote(asset.stooq);
    if (stooq) {
      return buildQuote(
        asset,
        stooq.price,
        stooq.previousClose,
        stooq.history,
        `Stooq · see also ${asset.sourceLabel}`,
      );
    }
  } catch {
    return null;
  }

  return null;
}

async function loadMarketsSnapshot(): Promise<MarketsSnapshot> {
  const results = await Promise.all(MARKET_ASSETS.map((asset) => fetchAssetQuote(asset)));
  const quotes = results.filter((q): q is MarketQuote => q != null);

  const providers = new Set(quotes.map((q) => q.source.split(" · ")[0]));

  return {
    asOf: new Date().toISOString(),
    quotes,
    provider: [...providers].join(" / ") || "unavailable",
    disclaimer: DISCLAIMER,
  };
}

/** Cached ~1 hour so homepage / tools share one daily-track refresh. */
export const getMarketsSnapshot = unstable_cache(
  loadMarketsSnapshot,
  ["markets-snapshot-v1"],
  { revalidate: 3600 },
);

export type { MarketAssetId, MarketQuote, MarketsSnapshot } from "./types";
