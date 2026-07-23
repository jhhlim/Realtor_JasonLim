import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { mockMarketReports } from "@/data/mock-market-reports";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/shared/fade-in";
import { CtaBanner } from "@/components/shared/cta-banner";

export const metadata = buildMetadata({
  title: "Market Reports",
  description:
    "Silicon Valley and South Bay real estate market reports — pricing, inventory, and neighborhood trends.",
  path: "/market-reports",
});

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export default function MarketReportsPage() {
  const reports = [...mockMarketReports].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return (
    <>
      <PageHero
        eyebrow="Market intelligence"
        title="Bay Area market reports"
        description="Concise reads on median prices, days on market, and where buyers still have room to negotiate."
        primaryCta={siteConfig.cta.subscribe}
        secondaryCta={siteConfig.cta.consultation}
      />

      <Section
        eyebrow="Archive"
        title="Latest reports"
        description="Mock data for development — replace with live analytics when ready."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {reports.map((report, index) => (
            <FadeIn key={report.id} delay={index * 0.05}>
              <Card className="group h-full border-border/70 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lift">
                <CardContent className="flex h-full flex-col gap-5 p-6 sm:p-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="accent">{report.region}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(report.publishedAt)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-balance">
                      <Link
                        href={`/market-reports/${report.slug}`}
                        className="transition-colors hover:text-accent"
                      >
                        {report.title}
                      </Link>
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                      {report.summary}
                    </p>
                  </div>
                  <div className="mt-auto grid grid-cols-2 gap-3">
                    {report.stats.slice(0, 4).map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-border/60 bg-slate-soft/60 px-3 py-2 dark:bg-secondary/30"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="font-display text-lg font-semibold">{stat.value}</p>
                        {stat.change ? (
                          <p className="text-xs text-muted-foreground">{stat.change}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  <Link
                    href={`/market-reports/${report.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-accent"
                  >
                    Read report
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Section>

      <CtaBanner
        title="Want these in your inbox?"
        description="Subscribe for market updates, or schedule a consultation for a custom neighborhood brief."
        primaryLabel={siteConfig.cta.subscribe.label}
        primaryHref={siteConfig.cta.subscribe.href}
      />
    </>
  );
}
