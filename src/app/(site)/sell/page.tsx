import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CircleDollarSign,
  DollarSign,
  Handshake,
  KeyRound,
  Lock,
  Megaphone,
  Sparkles,
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
    "Sell your Bay Area home with Compass Concierge, 3-phased marketing, data-backed pricing, and skilled negotiation — from prep through closing.",
  path: "/sell",
});

const COMPASS_PRIVATE_EXCLUSIVES =
  "https://www.compass.com/private-exclusives/";
const COMPASS_SELL_MARKETING =
  "https://marketing.compass.com/sell#jason-lim";
const COMPASS_CONCIERGE = "https://www.compass.com/concierge/";

const sellingSteps = [
  {
    title: "Pricing strategy",
    description:
      "Comprehensive CMA using recent comps, active competition, and micro-market trends — priced to attract buyers without leaving money on the table.",
    icon: DollarSign,
  },
  {
    title: "3-phased marketing",
    description:
      "Private Exclusive → Coming Soon → public launch. Test price and build demand before your home accrues days on market.",
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

const marketingPhases = [
  {
    phase: "Phase 1",
    title: "Compass Private Exclusive",
    description:
      "Market your home off-market to roughly 340,000 agents in the Compass network and their serious buyers. Test price, gather feedback, and build early interest — without public days on market or a visible price-drop history.",
    icon: Lock,
  },
  {
    phase: "Phase 2",
    title: "Coming Soon",
    description:
      "Expand reach on Compass.com (and partner sites) while you finish prep. More buyer eyes, more momentum — still before a full public MLS launch.",
    icon: Sparkles,
  },
  {
    phase: "Phase 3",
    title: "Public websites / MLS",
    description:
      "Go live on the broader market with pricing insights and demand already in hand — so your public debut is stronger, not a cold start.",
    icon: Megaphone,
  },
] as const;

export default function SellPage() {
  return (
    <>
      <PageHero
        eyebrow="Sell"
        title="Sell smarter in Silicon Valley"
        description="Compass Concierge for prep, 3-phased marketing for demand, and disciplined negotiation — so your home stands out and closes smoothly."
        primaryCta={siteConfig.cta.valuation}
        secondaryCta={siteConfig.cta.consultation}
      />

      <Section
        eyebrow="Compass Concierge"
        title="Get your home sale-ready with little to no money upfront"
        description="Painting, staging, flooring, landscaping, and more — Compass Concierge can front eligible prep costs so you don’t have to write a big check before listing."
      >
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <FadeIn>
            <Card className="h-full border-border/70 shadow-soft">
              <CardContent className="space-y-5 p-6 sm:p-8">
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="h-5 w-5 text-accent" />
                  <h3 className="font-display text-xl font-semibold">
                    How Concierge works
                  </h3>
                </div>
                <ol className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <li>
                    <span className="font-semibold text-foreground">1. Plan the prep.</span>{" "}
                    We identify high-ROI updates — staging, paint, floors, landscaping,
                    decluttering, and similar improvements buyers notice.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">
                      2. Compass helps front the cost.
                    </span>{" "}
                    Eligible services can be covered upfront through Compass Concierge so
                    cash flow doesn’t block a strong listing.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">
                      3. You repay at closing.
                    </span>{" "}
                    Typically paid from sale proceeds when escrow closes (or under program
                    terms if the listing ends earlier). Zero due until then in many cases —
                    subject to Concierge eligibility and local terms.
                  </li>
                </ol>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Concierge is subject to approval, program rules, and market terms. Loans
                  (where applicable) are provided by a third-party lender — not Compass as
                  the lender. I’ll walk you through what qualifies in your situation.
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Button asChild variant="accent">
                    <Link href={siteConfig.cta.consultation.href}>
                      Ask about Concierge
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <a
                      href={COMPASS_CONCIERGE}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn on Compass
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.06}>
            <Card className="h-full border-accent/25 bg-accent/5">
              <CardContent className="flex h-full flex-col justify-between gap-6 p-6 sm:p-8">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    Why sellers use it
                  </p>
                  <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                    <li>List looking its best without draining savings first</li>
                    <li>Often sells faster and for more when presentation is stronger</li>
                    <li>Pairs well with Private Exclusive / Coming Soon while work finishes</li>
                    <li>Repayment is usually timed with closing proceeds</li>
                  </ul>
                </div>
                <p className="text-sm font-medium text-foreground">
                  Thinking about selling but the house needs work first? Let’s talk through
                  Concierge options for your home.
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </Section>

      <Section
        eyebrow="3-phased marketing"
        title="Launch with strategy — not a cold start"
        description="The Compass 3-Phased Marketing Strategy helps protect value: validate price early, build demand, then go fully public when you’re ready."
        className="bg-slate-soft/50 dark:bg-card/30"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {marketingPhases.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.05}>
              <Card className="h-full border-border/70">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <item.icon className="h-5 w-5 text-accent" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {item.phase}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.12} className="mt-8">
          <Card className="border-border/70">
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
                You choose how far to take each phase. I’ll explain the tradeoffs for your
                neighborhood, timeline, and privacy needs — then run a plan built around
                your goals.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline" size="sm">
                  <a
                    href={COMPASS_PRIVATE_EXCLUSIVES}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Private Exclusives
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a
                    href={COMPASS_SELL_MARKETING}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Sell with Jason on Compass
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </Section>

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
              body: "Targeted staging and repair guidance — high ROI improvements only, not a generic checklist. Concierge can help fund the work.",
            },
            {
              title: "Phased exposure",
              body: "Private Exclusive and Coming Soon build demand before the full public launch — protecting price and positioning.",
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
        description="Start with a no-pressure valuation conversation — we'll review comps, Concierge, timing, and net proceeds together."
        primaryLabel={siteConfig.cta.valuation.label}
        primaryHref={siteConfig.cta.valuation.href}
        secondaryLabel={siteConfig.cta.consultation.label}
        secondaryHref={siteConfig.cta.consultation.href}
      />
    </>
  );
}
