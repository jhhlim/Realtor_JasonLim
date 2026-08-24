import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { RefinanceCalculator } from "@/features/tools/refinance-calculator";
import { ToolPageShell } from "@/features/tools/tool-page-shell";

export const metadata: Metadata = {
  title: `Refinance Break-Even Calculator | ${siteConfig.name}`,
  description: "See how many months it takes to recover refinance closing costs via payment savings.",
};

export default function RefinancePage() {
  return (
    <ToolPageShell
      title="Refinance break-even"
      description="Compare current vs new payments and estimate months to recover closing costs."
    >
      <RefinanceCalculator />
    </ToolPageShell>
  );
}
