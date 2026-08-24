import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { mockMarketReports } from "@/data/mock-market-reports";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/shared/fade-in";
import { CtaBanner } from "@/components/shared/cta-banner";

interface MarketReportPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return mockMarketReports.map((report) => ({ slug: report.slug }));
}

export async function generateMetadata({ params }: MarketReportPageProps) {
  const { slug } = await params;
  const report = mockMarketReports.find((r) => r.slug === slug);
  if (!report) {
    return buildMetadata({
      title: "Market report not found",
      path: `/market-reports/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: report.title,
    description: report.summary,
    path: `/market-reports/${report.slug}`,
  });
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export default async function MarketReportDetailPage({
  params,
}: MarketReportPageProps) {
  const { slug } = await params;
  const report = mockMarketReports.find((r) => r.slug === slug);
  if (!report) notFound();

  const related = mockMarketReports
    .filter((r) => r.slug !== report.slug)
    .slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={report.region}
        title={report.title}
        description={report.summary}
        primaryCta={siteConfig.cta.consultation}
        secondaryCta={siteConfig.cta.subscribe}
      >
        <p className="pt-2 text-sm text-muted-foreground">
          Published {formatDate(report.publishedAt)}
        </p>
      </PageHero>

      <Section
        eyebrow="Key metrics"
        title="Snapshot"
        description="Headline indicators for this reporting period."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {report.stats.map((stat, index) => (
            <FadeIn key={stat.label} delay={index * 0.05}>
              <Card className="h-full border-border/70 bg-gradient-to-b from-card to-slate-soft/50 dark:to-secondary/20">
                <CardContent className="space-y-2 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="font-display text-3xl font-semibold">{stat.value}</p>
                  {stat.change ? (
                    <Badge variant="secondary">{stat.change}</Badge>
                  ) : null}
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Analysis"
        title="What this means for buyers & sellers"
        description="Narrative context for the numbers above."
        className="bg-gradient-to-b from-slate-soft/80 to-background dark:from-card/30"
      >
        <div className="mx-auto max-w-3xl space-y-5 text-base leading-relaxed text-muted-foreground text-pretty">
          <p>{report.summary}</p>
          <p>
            For buyers, focus on neighborhoods where inventory and days on market create room to
            negotiate — while still competing hard in school-driven pockets. For sellers, launch
            pricing and presentation remain the highest-leverage decisions in the first two weeks
            on market.
          </p>
          <p>
            This report is illustrative mock data for the website build. Replace with live MLS
            and analytics pipelines before publishing externally.
          </p>
          <Button asChild variant="outline">
            <Link href="/market-reports">
              <ArrowLeft className="h-4 w-4" />
              All market reports
            </Link>
          </Button>
        </div>
      </Section>

      {related.length ? (
        <Section eyebrow="More reports" title="Continue reading">
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((item) => (
              <Card key={item.id} className="border-border/70">
                <CardContent className="space-y-3 p-5">
                  <Badge variant="outline">{item.region}</Badge>
                  <h3 className="font-display text-lg font-semibold leading-snug">
                    <Link
                      href={`/market-reports/${item.slug}`}
                      className="hover:text-accent"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {item.summary}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      <CtaBanner
        title="Want a custom neighborhood brief?"
        description="Schedule a consultation and we'll pull comps and trends for the cities you care about."
      />
    </>
  );
}
