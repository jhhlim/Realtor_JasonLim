import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { ToolStatusBadge } from "@/features/tools/tool-status-badge";
import { toolsCatalog } from "@/features/tools/tools-catalog";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Real Estate Tools & Calculators",
  description:
    "Bay Area buyer and investor tools — affordability, rent vs buy, cash flow, refinance, AI valuation previews, and market comparisons.",
  path: "/tools",
});

const categories = ["AI", "Buy", "Invest", "Mortgage", "Market"] as const;

export default function ToolsPage() {
  return (
    <>
      <PageHero
        eyebrow="Tools"
        title="Calculators built for Bay Area decisions"
        description="Interactive models for payments, affordability, investment returns, and neighborhood tradeoffs — plus AI previews for valuation and offer strategy."
        primaryCta={siteConfig.cta.consultation}
        secondaryCta={{ label: "Mortgage calculator", href: "/mortgage-calculator" }}
      />

      <Section className="pt-10 sm:pt-12">
        {categories.map((category) => {
          const tools = toolsCatalog.filter((tool) => tool.category === category);
          if (tools.length === 0) return null;

          return (
            <div key={category} className="mb-14 last:mb-0">
              <div className="mb-6 flex items-center gap-3">
                <h2 className="font-display text-2xl font-semibold tracking-tight">
                  {category}
                </h2>
                <Badge variant="outline">{tools.length}</Badge>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={tool.href}
                    className="group block h-full"
                  >
                    <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-lift">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-3">
                          <CardTitle className="text-lg">{tool.title}</CardTitle>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                        </div>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ToolStatusBadge status={tool.status} category={tool.category} />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </Section>

      <CtaBanner
        title="Want help interpreting the numbers?"
        description="We'll translate calculator output into an offer strategy, refinance timing, or investment thesis tailored to your goals."
      />
    </>
  );
}
