import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { MortgageComparisonCalculator } from "@/features/tools/mortgage-comparison-calculator";
import { ToolPageShell } from "@/features/tools/tool-page-shell";

export const metadata: Metadata = {
  title: `Mortgage Comparison | ${siteConfig.name}`,
  description: "Compare two or three Bay Area loan scenarios side by side.",
};

export default function MortgageComparisonPage() {
  return (
    <ToolPageShell
      title="Mortgage comparison"
      description="Line up 30-year, 15-year, and alternate down-payment scenarios to see total monthly cost."
    >
      <MortgageComparisonCalculator />
    </ToolPageShell>
  );
}
