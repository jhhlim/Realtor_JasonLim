import Link from "next/link";
import { ArrowUpRight, LineChart, Sparkles, TrendingUp } from "lucide-react";

import type { MarketReport } from "@/types";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/shared/fade-in";
import { formatCurrency } from "@/lib/utils";

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
  return (
    <Section
      eyebrow="Market intelligence"
      title="Clear signals for Bay Area decisions"
      description="Translate inventory, pricing, and rate dynamics into practical strategy — not noise."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-4 sm:grid-cols-3">
          {fallbackInsights.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.06}>
              <Card className="h-full border-border/70 bg-gradient-to-b from-card to-slate-soft/60 dark:to-secondary/30">
                <CardContent className="space-y-3 p-5">
                  <item.icon className="h-5 w-5 text-accent" />
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {item.title}
                  </p>
                  <p className="font-display text-2xl font-semibold">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.1}>
          <Card className="h-full overflow-hidden border-border/70">
            <CardContent className="flex h-full flex-col justify-between gap-6 p-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  Latest report
                </p>
                <h3 className="font-display text-2xl font-semibold tracking-tight">
                  {report?.title ?? "Silicon Valley Market Snapshot"}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                  {report?.summary ??
                    "A concise weekly read on median prices, days on market, and where buyers still have room to negotiate."}
                </p>
                {report?.stats?.length ? (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {report.stats.slice(0, 4).map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl bg-secondary/70 px-3 py-2.5 dark:bg-secondary/40"
                      >
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                        <p className="font-medium">{stat.value}</p>
                        {stat.change ? (
                          <p className="text-xs text-accent">{stat.change}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Median ranges commonly span {formatCurrency(1200000)}–
                    {formatCurrency(2800000)} depending on city and product type.
                  </p>
                )}
              </div>
              <Button asChild variant="outline" className="w-fit">
                <Link href={siteConfig.cta.marketReport.href}>
                  Read full report
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </Section>
  );
}
