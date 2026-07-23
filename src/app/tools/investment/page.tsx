import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { InvestmentCalculator } from "@/features/tools/investment-calculator";
import { ToolPageShell } from "@/features/tools/tool-page-shell";

export const metadata: Metadata = {
  title: `Investment Calculator | ${siteConfig.name}`,
  description: "Calculate cap rate and cash-on-cash returns for Bay Area investment properties.",
};

export default function InvestmentPage() {
  return (
    <ToolPageShell
      title="Investment returns"
      description="Model NOI, cap rate, and cash-on-cash return for rental or investment scenarios."
    >
      <InvestmentCalculator />
    </ToolPageShell>
  );
}
