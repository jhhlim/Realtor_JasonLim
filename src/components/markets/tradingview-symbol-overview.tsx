"use client";

import { useEffect, useId, useRef } from "react";

/**
 * Symbol Overview expects [displayName, "EXCHANGE:SYMBOL|range"].
 * (Name first — reversing this causes "Invalid symbol".)
 */
const SYMBOLS: [string, string][] = [
  ["Oil (WTI)", "TVC:USOIL|1D"],
  ["Gold", "TVC:GOLD|1D"],
  ["S&P 500", "FOREXCOM:SPXUSD|1D"],
  ["Dow", "FOREXCOM:DJI|1D"],
  ["Nasdaq 100", "FOREXCOM:NSXUSD|1D"],
];

export function TradingViewSymbolOverview({
  theme = "light",
}: {
  theme?: "light" | "dark";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reactId = useId().replace(/:/g, "");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";
    const widgetHost = document.createElement("div");
    widgetHost.className = "tradingview-widget-container__widget";
    container.appendChild(widgetHost);

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: SYMBOLS,
      chartOnly: false,
      width: "100%",
      height: 420,
      locale: "en",
      colorTheme: theme,
      autosize: true,
      showVolume: false,
      showMA: false,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: "right",
      scaleMode: "Normal",
      fontFamily:
        "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
      fontSize: "10",
      noTimeScale: false,
      valuesTracking: "1",
      changeMode: "price-and-percent",
      chartType: "area",
      lineWidth: 2,
      lineType: 0,
      dateRanges: ["1d|1", "1m|1D", "3m|60", "12m|1D", "60m|1W", "all|1M"],
    });
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [theme, reactId]);

  return (
    <div className="tradingview-widget-container min-h-[420px] w-full overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
      <div ref={containerRef} />
    </div>
  );
}
