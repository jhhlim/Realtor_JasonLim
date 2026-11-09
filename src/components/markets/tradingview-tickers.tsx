"use client";

import { useEffect, useRef } from "react";

/**
 * Browser-side TradingView ticker strip — loads in the visitor’s browser so
 * datacenter IP blocks on Yahoo/Stooq don’t blank the homepage.
 */
export function TradingViewTickers({
  theme = "light",
}: {
  theme?: "light" | "dark";
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";
    const widgetHost = document.createElement("div");
    widgetHost.className = "tradingview-widget-container__widget";
    container.appendChild(widgetHost);

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-tickers.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { description: "Oil (WTI)", proName: "TVC:USOIL" },
        { description: "Gold", proName: "TVC:GOLD" },
        { description: "S&P 500", proName: "FRED:SP500" },
        { description: "Dow", proName: "BLACKBULL:US30" },
        { description: "Nasdaq 100", proName: "FRED:NDQ100" },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: theme,
      locale: "en",
    });
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [theme]);

  return (
    <div className="tradingview-widget-container w-full overflow-hidden rounded-2xl border border-border/70 bg-card/80 px-1 py-1 shadow-soft">
      <div ref={containerRef} />
    </div>
  );
}
