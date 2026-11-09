/**
 * Shared TradingView symbols for free embed widgets.
 *
 * CME / COMEX / NYMEX futures (ES1!, NQ1!, YM1!, CL1!, GC1!) show
 * "This symbol is only available on TradingView" in third-party embeds —
 * they are not licensed for free widget redistribution.
 *
 * CAPITALCOM / FOREXCOM / TVC symbols trade nearly 24h and work in embeds,
 * so they are the practical stand-in for watching the tape before cash open.
 */

export const TICKER_SYMBOLS = [
  { description: "Oil (WTI)", proName: "TVC:USOIL" },
  { description: "Gold", proName: "TVC:GOLD" },
  { description: "S&P 500", proName: "FOREXCOM:SPXUSD" },
  { description: "Dow", proName: "FOREXCOM:DJI" },
  { description: "Nasdaq 100", proName: "FOREXCOM:NSXUSD" },
  /** Nearly 24h — morning-open proxies (embed-safe) */
  { description: "US500 (24h)", proName: "CAPITALCOM:US500" },
  { description: "US100 (24h)", proName: "CAPITALCOM:US100" },
  { description: "US30 (24h)", proName: "CAPITALCOM:US30" },
] as const;

/** Symbol Overview: [displayName, "EXCHANGE:SYMBOL|range"] — name first. */
export const OVERVIEW_SYMBOLS: [string, string][] = [
  ["Oil (WTI)", "TVC:USOIL|1D"],
  ["Gold", "TVC:GOLD|1D"],
  ["S&P 500", "FOREXCOM:SPXUSD|1D"],
  ["Dow", "FOREXCOM:DJI|1D"],
  ["Nasdaq 100", "FOREXCOM:NSXUSD|1D"],
  ["US500 (24h)", "CAPITALCOM:US500|1D"],
  ["US100 (24h)", "CAPITALCOM:US100|1D"],
  ["US30 (24h)", "CAPITALCOM:US30|1D"],
];

/** Deep links to real CME futures on TradingView (not embeddable). */
export const FUTURES_TV_LINKS = [
  {
    label: "ES (S&P)",
    href: "https://www.tradingview.com/symbols/CME_MINI-ES1!/",
  },
  {
    label: "NQ (Nasdaq)",
    href: "https://www.tradingview.com/symbols/CME_MINI-NQ1!/",
  },
  {
    label: "YM (Dow)",
    href: "https://www.tradingview.com/symbols/CBOT_MINI-YM1!/",
  },
  {
    label: "CL (Oil)",
    href: "https://www.tradingview.com/symbols/NYMEX-CL1!/",
  },
  {
    label: "GC (Gold)",
    href: "https://www.tradingview.com/symbols/COMEX-GC1!/",
  },
] as const;
