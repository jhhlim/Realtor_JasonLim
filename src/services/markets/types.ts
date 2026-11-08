export type MarketAssetId =
  | "oil"
  | "gold"
  | "sp500"
  | "dow"
  | "nasdaq";

export interface MarketHistoryPoint {
  date: string; // YYYY-MM-DD
  close: number;
}

export interface MarketQuote {
  id: MarketAssetId;
  name: string;
  shortName: string;
  symbol: string;
  price: number;
  previousClose: number;
  change: number;
  changePct: number;
  unit: string;
  currency: string;
  marketState?: string;
  updatedAt: string;
  source: string;
  sourceUrl: string;
  history: MarketHistoryPoint[];
}

export interface MarketsSnapshot {
  asOf: string;
  quotes: MarketQuote[];
  provider: string;
  disclaimer: string;
}

export const MARKET_ASSETS: {
  id: MarketAssetId;
  name: string;
  shortName: string;
  yahoo: string;
  stooq: string;
  unit: string;
  sourceUrl: string;
  sourceLabel: string;
}[] = [
  {
    id: "oil",
    name: "WTI Crude Oil",
    shortName: "Oil",
    yahoo: "CL=F",
    stooq: "cl.f",
    unit: "/bbl",
    sourceUrl: "https://oilprice.com/",
    sourceLabel: "OilPrice.com",
  },
  {
    id: "gold",
    name: "Gold (Futures)",
    shortName: "Gold",
    yahoo: "GC=F",
    stooq: "gc.f",
    unit: "/oz",
    sourceUrl: "https://goldprice.org/",
    sourceLabel: "GoldPrice.org",
  },
  {
    id: "sp500",
    name: "S&P 500",
    shortName: "S&P 500",
    yahoo: "^GSPC",
    stooq: "^spx",
    unit: "",
    sourceUrl: "https://www.cnbc.com/sp-500/",
    sourceLabel: "CNBC",
  },
  {
    id: "dow",
    name: "Dow Jones",
    shortName: "Dow",
    yahoo: "^DJI",
    stooq: "^dji",
    unit: "",
    sourceUrl: "https://www.cnbc.com/dow-30/",
    sourceLabel: "CNBC",
  },
  {
    id: "nasdaq",
    name: "Nasdaq Composite",
    shortName: "Nasdaq",
    yahoo: "^IXIC",
    stooq: "^ndq",
    unit: "",
    sourceUrl: "https://www.cnbc.com/nasdaq-100/",
    sourceLabel: "CNBC",
  },
];
