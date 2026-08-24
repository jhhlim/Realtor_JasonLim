import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { MarketPredictionForm } from "@/features/tools/market-prediction-form";
import { MarketPredictionStub } from "@/features/tools/market-prediction-stub";
import { ToolPageShell } from "@/features/tools/tool-page-shell";

export const metadata: Metadata = {
  title: `Market Prediction | ${siteConfig.name}`,
  description:
    "Forward-looking Bay Area market outlook powered by AI — coming soon. Includes important forecasting disclaimer.",
};

export default function MarketPredictionPage() {
  return (
    <ToolPageShell
      eyebrow="AI tools"
      title="Market prediction"
      description="An upcoming AI brief for inventory, rates, and city-level price bands — with clear disclaimers that forecasts are not guarantees."
    >
      <div className="space-y-10">
        <MarketPredictionStub />
        <MarketPredictionForm />
      </div>
    </ToolPageShell>
  );
}
