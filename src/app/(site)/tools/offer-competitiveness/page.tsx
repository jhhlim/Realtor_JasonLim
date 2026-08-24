import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { OfferCompetitivenessForm } from "@/features/tools/offer-competitiveness-form";
import { OfferCompetitivenessStub } from "@/features/tools/offer-competitiveness-stub";
import { ToolPageShell } from "@/features/tools/tool-page-shell";

export const metadata: Metadata = {
  title: `Offer Competitiveness | ${siteConfig.name}`,
  description:
    "AI offer scoring is coming soon. Use the checklist to pressure-test competitive Bay Area offers today.",
};

export default function OfferCompetitivenessPage() {
  return (
    <ToolPageShell
      eyebrow="AI tools"
      title="Offer competitiveness"
      description="Strengthen your offer structure with a practical checklist while AI win-probability scoring is under construction."
    >
      <div className="space-y-10">
        <OfferCompetitivenessStub />
        <OfferCompetitivenessForm />
      </div>
    </ToolPageShell>
  );
}
