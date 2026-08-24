import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { HomeValuationForm } from "@/features/tools/home-valuation-form";
import { ToolPageShell } from "@/features/tools/tool-page-shell";

export const metadata: Metadata = {
  title: `AI Home Valuation | ${siteConfig.name}`,
  description:
    "Instant AI home valuation analysis for Bay Area properties — affordability, risks, negotiation, and Jason's personal recommendation.",
};

export default function HomeValuationPage() {
  return (
    <ToolPageShell
      title="AI home valuation"
      description="Get an instant AI read on your property — affordability, risks, negotiation ideas, and appreciation outlook — plus Jason's personal recommendation."
    >
      <HomeValuationForm />
    </ToolPageShell>
  );
}
