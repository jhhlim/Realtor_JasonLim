import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { CashFlowCalculator } from "@/features/tools/cash-flow-calculator";
import { ToolPageShell } from "@/features/tools/tool-page-shell";

export const metadata: Metadata = {
  title: `Rental Cash Flow Calculator | ${siteConfig.name}`,
  description:
    "Estimate monthly rental cash flow after vacancy, expenses, and mortgage payments.",
};

export default function CashFlowPage() {
  return (
    <ToolPageShell
      title="Rental cash flow"
      description="Build a monthly cash-flow picture including vacancy, management, taxes, and debt service."
    >
      <CashFlowCalculator />
    </ToolPageShell>
  );
}
