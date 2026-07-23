import { notFound } from "next/navigation";

import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { siteConfig } from "@/config/site";
import { AffordabilityCalculator } from "@/features/tools/affordability-calculator";
import { CashFlowCalculator } from "@/features/tools/cash-flow-calculator";
import { HomeValuationForm } from "@/features/tools/home-valuation-form";
import { InvestmentCalculator } from "@/features/tools/investment-calculator";
import { MarketPredictionForm } from "@/features/tools/market-prediction-form";
import { MortgageComparisonCalculator } from "@/features/tools/mortgage-comparison-calculator";
import { NeighborhoodComparisonCalculator } from "@/features/tools/neighborhood-comparison-calculator";
import { OfferCompetitivenessForm } from "@/features/tools/offer-competitiveness-form";
import { RefinanceCalculator } from "@/features/tools/refinance-calculator";
import { RentVsBuyCalculator } from "@/features/tools/rent-vs-buy-calculator";
import { SchoolComparisonPlaceholder } from "@/features/tools/school-comparison-placeholder";
import {
  getToolBySlug,
  toolsUnderToolsRoute,
  type ToolCatalogItem,
} from "@/features/tools/tools-catalog";
import { buildMetadata } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return toolsUnderToolsRoute.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool || !tool.href.startsWith("/tools/")) {
    return buildMetadata({ title: "Tool not found", noIndex: true });
  }

  return buildMetadata({
    title: tool.title,
    description: tool.description,
    path: tool.href,
  });
}

function ToolBody({ tool }: { tool: ToolCatalogItem }) {
  switch (tool.slug) {
    case "home-valuation":
      return <HomeValuationForm />;
    case "affordability":
      return <AffordabilityCalculator />;
    case "rent-vs-buy":
      return <RentVsBuyCalculator />;
    case "investment":
      return <InvestmentCalculator />;
    case "cash-flow":
      return <CashFlowCalculator />;
    case "refinance":
      return <RefinanceCalculator />;
    case "mortgage-comparison":
      return <MortgageComparisonCalculator />;
    case "neighborhood-comparison":
      return <NeighborhoodComparisonCalculator />;
    case "school-comparison":
      return <SchoolComparisonPlaceholder />;
    case "offer-competitiveness":
      return <OfferCompetitivenessForm />;
    case "market-prediction":
      return <MarketPredictionForm />;
    default:
      return null;
  }
}

function toolCta(tool: ToolCatalogItem) {
  if (tool.status === "ai-stub") {
    return siteConfig.cta.consultation;
  }
  if (tool.category === "Invest") {
    return {
      label: "Discuss investment strategy",
      href: "/contact?interest=invest",
    };
  }
  return siteConfig.cta.consultation;
}

export default async function ToolPage({ params }: { params: Params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool || !tool.href.startsWith("/tools/")) {
    notFound();
  }

  return (
    <>
      <PageHero
        eyebrow={`${tool.category} · Tools`}
        title={tool.title}
        description={tool.description}
        primaryCta={toolCta(tool)}
        secondaryCta={{ label: "All tools", href: "/tools" }}
      />
      <Section className="pt-10 sm:pt-12">
        <ToolBody tool={tool} />
      </Section>
      <CtaBanner
        title={
          tool.status === "ai-stub"
            ? "Prefer a human-reviewed analysis?"
            : "Ready to put these numbers into action?"
        }
        description={
          tool.status === "ai-stub"
            ? "AI previews are coming soon — book a consultation for comps, strategy, and market context today."
            : "We'll stress-test assumptions against your timeline, lender profile, and local competition."
        }
      />
    </>
  );
}
