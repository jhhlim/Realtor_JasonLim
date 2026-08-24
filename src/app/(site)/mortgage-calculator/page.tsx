import type { Metadata } from "next";

import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { siteConfig } from "@/config/site";
import { MortgageCalculator } from "@/features/mortgage/mortgage-calculator";

export const metadata: Metadata = {
  title: `Mortgage Calculator | ${siteConfig.name}`,
  description:
    "Estimate Bay Area mortgage payments including taxes, insurance, HOA, PMI, and extra principal — with amortization charts.",
};

export default function MortgageCalculatorPage() {
  return (
    <>
      <PageHero
        eyebrow="Tools"
        title="Mortgage calculator"
        description="Model principal & interest, property taxes, insurance, HOA, and PMI for Silicon Valley purchase scenarios. Adjust down payment and rate to see how monthly cash flow shifts."
        primaryCta={siteConfig.cta.consultation}
        secondaryCta={{ label: "More tools", href: "/tools" }}
      />
      <Section className="pt-10 sm:pt-12">
        <MortgageCalculator />
      </Section>
      <CtaBanner
        title="Want a payment plan that fits your offer strategy?"
        description="We'll stress-test rates, HOA, and Mello-Roos against your true monthly budget before you write."
      />
    </>
  );
}
