import Link from "next/link";
import {
  ArrowRight,
  Camera,
  DollarSign,
  Handshake,
  KeyRound,
  Megaphone,
  TrendingUp,
  Users,
} from "lucide-react";

import { CtaBanner } from "@/components/shared/cta-banner";
import { FadeIn } from "@/components/shared/fade-in";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sell Your Home",
  description:
    "Sell your Bay Area home with data-backed pricing, professional marketing, and skilled negotiation — from listing prep through closing.",
  path: "/sell",
});

const sellingSteps = [
  {
    title: "Pricing strategy",
    description:
      "Comprehensive CMA using recent comps, active competition, and micro-market trends — priced to attract buyers without leaving money on the table.",
    icon: DollarSign,
  },
  {
    title: "Marketing plan",
    description:
      "MLS syndication, targeted digital campaigns, and listing copy that highlights what buyers actually search for in Silicon Valley.",
    icon: Megaphone,
  },
  {
    title: "Professional photography",
    description:
      "HDR photography, floor plans, and optional video or drone — first impressions drive showings in a visual market.",
    icon: Camera,
  },
  {
    title: "Open houses & showings",
    description:
      "Coordinated showing schedule, feedback loops, and open-house strategy designed to generate strong offers.",
    icon: Users,
  },
  {
    title: "Offer review & negotiation",
    description:
      "Compare price, contingencies, appraisal risk, and close timelines. Negotiate terms that protect your net proceeds.",
    icon: Handshake,
  },
  {
    title: "Escrow & closing",
    description:
      "Manage disclosures, repairs, buyer requests, and final walkthrough — through recording and wire confirmation.",
    icon: KeyRound,
  },
] as const;

export default function SellPage() {
  return (
    <>
      <PageHero
        eyebrow="Sell"
        title="Sell smarter in Silicon Valley"
        description="Data-backed pricing, polished marketing, and disciplined negotiation — so your home stands out and closes smoothly."
        primaryCta={siteConfig.cta.valuation}
        secondaryCta={siteConfig.cta.consultation}
      />

      <Section
        eyebrow="Process"
        title="The selling process"
        description="Every listing gets a deliberate plan — not a template. Here's how we move from valuation to closed escrow."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sellingSteps.map((step, index) => (
            <FadeIn key={step.title} delay={index * 0.04}>
              <Card className="h-full border-border/70">
                <CardContent className="space-y-4 p-6">
                  <step.icon className="h-5 w-5 text-accent" />
                  <div className="space-y-2">
                    <h3 className="font-display text-xl font-semibold">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Valuation"
        title="Know what your home is worth"
        description="Online estimates are a starting point — not a strategy. Request a personalized valuation backed by local comps and current buyer demand."
        className="bg-slate-soft/50 dark:bg-card/30"
      >
        <FadeIn>
          <Card className="overflow-hidden border-border/70 shadow-lift">
            <CardContent className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <p className="font-display text-2xl font-semibold tracking-tight">
                    Home valuation request
                  </p>
                </div>
                <p className="max-w-xl leading-relaxed text-muted-foreground text-pretty">
                  Share your address and timeline — I&apos;ll prepare a comparative market
                  analysis with suggested list price range, prep recommendations, and
                  expected days on market for your neighborhood.
                </p>
              </div>
              <Button asChild size="lg" variant="accent" className="w-full sm:w-auto">
                <Link href={siteConfig.cta.valuation.href}>
                  {siteConfig.cta.valuation.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      </Section>

      <Section
        eyebrow="Why it matters"
        title="Marketing that matches the market"
        description="Silicon Valley buyers compare dozens of listings online before they tour. Presentation and pricing precision determine whether yours makes the shortlist."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Prep with purpose",
              body: "Targeted staging and repair guidance — high ROI improvements only, not a generic checklist.",
            },
            {
              title: "Analytics-driven",
              body: "Track showing activity, portal views, and feedback to adjust strategy in the first two weeks.",
            },
            {
              title: "Negotiation discipline",
              body: "Engineering mindset applied to counteroffers — clear math on net proceeds before you accept.",
            },
          ].map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.05}>
              <Card className="h-full border-border/70">
                <CardContent className="space-y-2 p-6">
                  <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Section>

      <CtaBanner
        title="Thinking about selling this year?"
        description="Start with a no-pressure valuation conversation — we'll review comps, timing, and net proceeds together."
        primaryLabel={siteConfig.cta.valuation.label}
        primaryHref={siteConfig.cta.valuation.href}
        secondaryLabel={siteConfig.cta.consultation.label}
        secondaryHref={siteConfig.cta.consultation.href}
      />
    </>
  );
}
