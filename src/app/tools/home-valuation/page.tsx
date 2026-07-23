import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { HomeValuationForm } from "@/features/tools/home-valuation-form";
import { ToolPageShell } from "@/features/tools/tool-page-shell";

export const metadata: Metadata = {
  title: `AI Home Valuation | ${siteConfig.name}`,
  description:
    "Request a Bay Area home valuation. AI automated estimates coming soon — lead capture available now.",
};

export default function HomeValuationPage() {
  return (
    <ToolPageShell
      title="AI home valuation"
      description="Get a data-informed read on your home's market position. Automated AI estimates are on the way — share your address for a personal CMA follow-up today."
    >
      <HomeValuationForm />
    </ToolPageShell>
  );
}
