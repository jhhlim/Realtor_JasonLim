import Link from "next/link";
import { ArrowUpRight, LineChart, Sparkles, TrendingUp } from "lucide-react";

import type { MarketReport } from "@/types";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/shared/fade-in";

const fallbackInsights = [
  {
    title: "Inventory pulse",
    value: "Tight",
    detail: "Selective supply across core Silicon Valley cities.",
    icon: LineChart,
  },
  {
    title: "Buyer leverage",
    value: "Rising",
    detail: "Negotiation room improves with data-backed offers.",
    icon: TrendingUp,
  },
  {
    title: "AI edge",
    value: "Live",
    detail: "Weekly comps, rate scenarios, and neighborhood scores.",
    icon: Sparkles,
  },
];

interface MarketInsightsProps {
  report?: MarketReport | null;
}

export function MarketInsights({ report }: MarketInsightsProps) {
  const reportHref = report
    ? `/market-reports/${report.slug}`
    : siteConfig.cta.marketReport.href;

  return (
    <Section
      eyebrow="Market Insights"
      title="Latest from the market"
      description="Santa Clara County detached inventory, pendings, and neighborhood signals — updated weekly."
      className="bg-gradient-to-b from-slate-soft/70 to-background dark:from-card/25"
    >
      <FadeIn>
        <Card className="border-border/80 shadow-lift">
          <CardContent className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-stretch lg:justify-between lg:p-10">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                Latest report
              </p>
              <h3 className="font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                <Link
                  href={reportHref}
                  className="transition-colors hover:text-accent"
                >
                  {report?.title ?? "Silicon Valley Market Snapshot"}
                </Link>
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
                {report?.summary ??
                  "A concise weekly read on median prices, days on market, and where buyers still have room to negotiate."}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild variant="accent" size="lg">
                  <Link href={reportHref}>
                    Read full report
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/market-reports">All market reports</Link>
                </Button>
              </div>
            </div>

            {report?.stats?.length ? (
              <div className="grid w-full gap-3 sm:grid-cols-2 lg:max-w-md">
                {report.stats.slice(0, 4).map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-border/60 bg-secondary/60 px-4 py-3 dark:bg-secondary/40"
                  >
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="font-display text-2xl font-semibold">
                      {stat.value}
                    </p>
                    {stat.change ? (
                      <p className="text-xs text-accent">{stat.change}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid w-full gap-3 sm:grid-cols-3 lg:max-w-xl">
                {fallbackInsights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border/60 bg-secondary/60 px-4 py-3 dark:bg-secondary/40"
                  >
                    <item.icon className="mb-2 h-4 w-4 text-accent" />
                    <p className="text-xs text-muted-foreground">{item.title}</p>
                    <p className="font-display text-xl font-semibold">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </Section>
  );
}
