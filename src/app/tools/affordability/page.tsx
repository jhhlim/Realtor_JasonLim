import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { AffordabilityCalculator } from "@/features/tools/affordability-calculator";
import { ToolPageShell } from "@/features/tools/tool-page-shell";

export const metadata: Metadata = {
  title: `Affordability Calculator | ${siteConfig.name}`,
  description:
    "Estimate how much home you can afford in the Bay Area based on income, debts, and mortgage rates.",
};

export default function AffordabilityPage() {
  return (
    <ToolPageShell
      title="Affordability calculator"
      description="Translate income and monthly obligations into an illustrative max purchase price under common DTI heuristics."
    >
      <AffordabilityCalculator />
    </ToolPageShell>
  );
}
