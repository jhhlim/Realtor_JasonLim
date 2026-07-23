import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { NeighborhoodComparisonTool } from "@/features/tools/neighborhood-comparison-tool";
import { ToolPageShell } from "@/features/tools/tool-page-shell";

export const metadata: Metadata = {
  title: `Neighborhood Comparison | ${siteConfig.name}`,
  description:
    "Compare Bay Area communities on median price, DOM, schools, and lifestyle using mock market data.",
};

export default function NeighborhoodComparisonPage() {
  return (
    <ToolPageShell
      title="Neighborhood comparison"
      description="Pick two Silicon Valley communities and compare pricing, days on market, and lifestyle highlights."
    >
      <NeighborhoodComparisonTool />
    </ToolPageShell>
  );
}
