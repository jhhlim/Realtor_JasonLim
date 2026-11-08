import type { MarketHistoryPoint } from "./types";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

interface YahooChartResult {
  meta?: {
    symbol?: string;
    currency?: string;
    regularMarketPrice?: number;
    chartPreviousClose?: number;
    previousClose?: number;
    marketState?: string;
  };
  timestamp?: number[];
  indicators?: {
    quote?: Array<{
      close?: Array<number | null>;
    }>;
  };
}

function toDate(ts: number) {
  return new Date(ts * 1000).toISOString().slice(0, 10);
}

export async function fetchYahooChart(symbol: string): Promise<{
  price: number;
  previousClose: number;
  currency: string;
  marketState?: string;
  history: MarketHistoryPoint[];
} | null> {
  const encoded = encodeURIComponent(symbol);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encoded}?range=1mo&interval=1d`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;

  const json = (await res.json()) as {
    chart?: { result?: YahooChartResult[]; error?: unknown };
  };
  const result = json.chart?.result?.[0];
  if (!result?.meta?.regularMarketPrice) return null;

  const closes = result.indicators?.quote?.[0]?.close ?? [];
  const timestamps = result.timestamp ?? [];
  const history: MarketHistoryPoint[] = [];

  for (let i = 0; i < timestamps.length; i += 1) {
    const close = closes[i];
    const ts = timestamps[i];
    if (close != null && Number.isFinite(close) && ts != null) {
      history.push({ date: toDate(ts), close });
    }
  }

  const price = result.meta.regularMarketPrice;
  const previousClose =
    result.meta.chartPreviousClose ??
    result.meta.previousClose ??
    history.at(-2)?.close ??
    price;

  return {
    price,
    previousClose,
    currency: result.meta.currency ?? "USD",
    marketState: result.meta.marketState,
    history,
  };
}
