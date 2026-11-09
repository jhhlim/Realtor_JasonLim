/** Shared TradingView symbols — cash/spot + futures for morning opens. */

export const TICKER_SYMBOLS = [
  { description: "Oil (WTI)", proName: "TVC:USOIL" },
  { description: "Gold", proName: "TVC:GOLD" },
  { description: "S&P 500", proName: "FOREXCOM:SPXUSD" },
  { description: "Dow", proName: "FOREXCOM:DJI" },
  { description: "Nasdaq 100", proName: "FOREXCOM:NSXUSD" },
  /** Futures — trade nearly 24h; useful before cash open */
  { description: "ES Futures", proName: "CME_MINI:ES1!" },
  { description: "NQ Futures", proName: "CME_MINI:NQ1!" },
  { description: "YM Futures", proName: "CBOT_MINI:YM1!" },
  { description: "CL Futures", proName: "NYMEX:CL1!" },
  { description: "GC Futures", proName: "COMEX:GC1!" },
] as const;

/** Symbol Overview: [displayName, "EXCHANGE:SYMBOL|range"] */
export const OVERVIEW_SYMBOLS: [string, string][] = [
  ["Oil (WTI)", "TVC:USOIL|1D"],
  ["Gold", "TVC:GOLD|1D"],
  ["S&P 500", "FOREXCOM:SPXUSD|1D"],
  ["Dow", "FOREXCOM:DJI|1D"],
  ["Nasdaq 100", "FOREXCOM:NSXUSD|1D"],
  ["ES Futures", "CME_MINI:ES1!|1D"],
  ["NQ Futures", "CME_MINI:NQ1!|1D"],
  ["YM Futures", "CBOT_MINI:YM1!|1D"],
  ["CL Futures", "NYMEX:CL1!|1D"],
  ["GC Futures", "COMEX:GC1!|1D"],
];
