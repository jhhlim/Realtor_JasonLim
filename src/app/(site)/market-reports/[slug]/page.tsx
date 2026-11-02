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

      {report.areas && report.areas.length > 0 ? (
        <Section
          eyebrow="By area"
          title="Listings & pendings"
          description="Active listings on the effective date vs. pendings in the prior 7 days."
        >
          <div className="overflow-x-auto rounded-2xl border border-border/70">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Area</th>
                  <th className="px-4 py-3 font-semibold">Listings</th>
                  <th className="px-4 py-3 font-semibold">WoW</th>
                  <th className="px-4 py-3 font-semibold">Pendings</th>
                  <th className="px-4 py-3 font-semibold">WoW</th>
                  <th className="px-4 py-3 font-semibold">Median (Oct 1)</th>
                  <th className="px-4 py-3 font-semibold">MOI</th>
                </tr>
              </thead>
              <tbody>
                {report.areas.map((area) => {
                  const listingDelta =
                    area.priorListings != null
                      ? area.listings - area.priorListings
                      : null;
                  const pendingDelta =
                    area.priorPendings != null
                      ? area.pendings - area.priorPendings
                      : null;
                  const fmtDelta = (n: number | null) => {
                    if (n == null) return "—";
                    if (n === 0) return "flat";
                    return n > 0 ? `+${n}` : `${n}`;
                  };
                  return (
                    <tr
                      key={area.name}
                      className="border-t border-border/60 odd:bg-card even:bg-slate-soft/40 dark:even:bg-secondary/20"
                    >
                      <td className="px-4 py-3 font-medium">{area.name}</td>
                      <td className="px-4 py-3 tabular-nums">{area.listings}</td>
                      <td className="px-4 py-3 tabular-nums text-muted-foreground">
                        {fmtDelta(listingDelta)}
                      </td>
                      <td className="px-4 py-3 tabular-nums">{area.pendings}</td>
                      <td className="px-4 py-3 tabular-nums text-muted-foreground">
                        {fmtDelta(pendingDelta)}
                      </td>
                      <td className="px-4 py-3 tabular-nums">
                        {area.medianPrice ?? "—"}
                      </td>
                      <td className="px-4 py-3 tabular-nums">{area.moi ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {report.areasNote ? (
            <p className="mt-3 text-xs text-muted-foreground">{report.areasNote}</p>
          ) : null}
        </Section>
      ) : null}

      <Section
        eyebrow="Analysis"
        title="What this means for buyers & sellers"
        description="Narrative context for the numbers above."
        className="bg-gradient-to-b from-slate-soft/80 to-background dark:from-card/30"
      >
        <div className="mx-auto max-w-3xl space-y-5 text-base leading-relaxed text-muted-foreground text-pretty">
          <p>{report.summary}</p>
          {report.slug === "scc-detached-homes-november-1-2026" ? (
            <>
              <p>
                Inventory tightened into November: active listings fell 36 week over
                week to 729, while pendings ticked up slightly to 77. That mix — fewer
                actives with a modest pending rebound — can keep well-priced homes
                competitive even as the fall market typically cools.
              </p>
              <p>
                The biggest listing declines were in Central San Jose (−9), Cambrian
                (−8), Cupertino (−8), and Campbell (−7). Los Altos Hills added a few
                listings but recorded zero pendings this week. Sunnyvale stood out on
                the demand side with pendings up to 11 (+3).
              </p>
              <p>
                On the Oct. 1 snapshot, months of inventory remained tightest in
                Sunnyvale (0.7), Mountain View (0.8), and Los Altos (0.9). Higher-MOI
                pockets like Cambrian, Central San Jose, and Saratoga still tend to
                leave more room for negotiation when pricing matches current comps.
              </p>
              <p>
                For sellers: lean into presentation and realistic launch pricing —
                thinner November inventory can help, but only if the home is market-
                ready. For buyers: use the city-level pending table to spot where
                competition is heating up again (Sunnyvale, Cupertino, Cambrian) versus
                where choice is still wider.
              </p>
            </>
          ) : report.slug === "scc-detached-homes-october-25-2026" ? (
            <>
              <p>
                Inventory held steady at the county composite level, but the story is
                still local. Willow Glen (+7 listings), Cupertino (+4), Los Altos (+5),
                and Sunnyvale (+3) added supply, while Los Gatos / Monte Sereno (−8),
                Los Altos Hills (−4), and Central San Jose (−3) tightened a bit.
              </p>
              <p>
                Pending activity cooled meaningfully (−17 week over week). Cambrian,
                Cupertino, Palo Alto, and Santa Clara saw the sharpest pending pullbacks
                — a signal that buyers are more selective even where listings remain
                available.
              </p>
              <p>
                On the Oct. 1 snapshot, months of inventory stayed tightest in
                Sunnyvale (0.7), Mountain View (0.8), and Los Altos (0.9). Higher-MOI
                pockets like Cambrian, Central San Jose, and Saratoga (around 2.3–2.4)
                tend to leave more room for negotiation when homes are priced to
                current comps.
              </p>
              <p>
                For sellers: launch pricing and presentation still matter most in the
                first two weeks. For buyers: watch pending velocity in your target
                neighborhood — flat listings with softer pendings can open inspection
                and credit conversations that weren’t available in hotter weeks.
              </p>
            </>
          ) : report.slug === "two-housing-markets-october-20-2026" ? (
            <>
              <p>
                Luxury demand and rate-sensitive households are moving on different
                timelines. Headline sales can coexist with tough affordability for
                first-time and middle-income buyers — especially across San Jose and
                the greater Silicon Valley.
              </p>
              <p>
                Life events still drive most moves. Realistic pricing for sellers and
                neighborhood-level strategy for buyers matter more than waiting for a
                perfect rate print.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild variant="accent">
                  <Link href="/blog/82-million-home-sale-two-housing-markets-october-2026">
                    Read the full Market Insights article
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={siteConfig.cta.valuation.href}>
                    Request a Personalized Home Valuation
                  </Link>
                </Button>
              </div>
            </>
          ) : report.slug === "scc-detached-homes-october-4-2026" ? (
            <>
              <p>
                Compared with Sept. 27, Santa Clara County detached inventory cooled
                slightly while sales activity improved. That mix can keep select
                pockets competitive even as overall listings remain higher than the
                ultra-tight years earlier in the cycle.
              </p>
              <p>
                City-level listings and pendings on Oct. 4 show meaningful differences:
                Palo Alto and Santa Clara had relatively strong pending activity,
                Central San Jose carried the largest listing count with lighter
                pendings, and thinner Peninsula/foothill inventory (Los Altos, Los
                Altos Hills, Mountain View) can still move quickly when priced to
                market.
              </p>
              <p>
                For buyers, focus on condition and price relative to nearby pendings.
                For sellers, launch pricing and presentation remain the highest-leverage
                decisions in the first two weeks on market.
              </p>
            </>
          ) : (
            <>
              <p>
                For buyers, focus on neighborhoods where inventory and days on market
                create room to negotiate — while still competing hard in school-driven
                pockets. For sellers, launch pricing and presentation remain the
                highest-leverage decisions in the first two weeks on market.
              </p>
            </>
          )}
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
        title="Request a Personalized Home Valuation"
        description="I'll share comps, neighborhood context, and a clear next-step plan for your address."
        primaryLabel="Request a Personalized Home Valuation"
        primaryHref={siteConfig.cta.valuation.href}
        secondaryLabel="Let's Connect"
        secondaryHref={siteConfig.cta.consultation.href}
      />
    </>
  );
}
