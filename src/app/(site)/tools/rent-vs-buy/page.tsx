import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { RentVsBuyCalculator } from "@/features/tools/rent-vs-buy-calculator";
import { ToolPageShell } from "@/features/tools/tool-page-shell";

export const metadata: Metadata = {
  title: `Rent vs Buy Calculator | ${siteConfig.name}`,
  description:
    "Compare renting versus buying in the South Bay over your expected holding period.",
};

export default function RentVsBuyPage() {
  return (
    <ToolPageShell
      title="Rent vs buy"
      description="Stress-test rent growth, appreciation, and ownership costs to see which path may win over your horizon."
    >
      <RentVsBuyCalculator />
    </ToolPageShell>
  );
}
