import Link from "next/link";
import {
  Calculator,
  ClipboardCheck,
  Download,
  FileSearch,
  HandCoins,
  Home,
  KeyRound,
  Search,
  ShieldCheck,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/shared/fade-in";
import { CtaBanner } from "@/components/shared/cta-banner";

export const metadata = buildMetadata({
  title: "Buy a Home in the Bay Area",
  description:
    "A clear Silicon Valley buying process — from consultation and pre-approval through offer, inspection, escrow, and closing.",
  path: "/buy",
});

const timeline = [
  {
    title: "Consultation",
    description:
      "Clarify budget, neighborhoods, commute, schools, and timeline. We define must-haves vs. nice-to-haves.",
    icon: ClipboardCheck,
  },
  {
    title: "Pre-approval",
    description:
      "Connect with trusted lenders, stress-test payments, and lock a credible offer strategy.",
    icon: ShieldCheck,
  },
  {
    title: "Search",
    description:
      "Targeted tours, private showings, and data on comps / DOM so you know what “fair” looks like.",
    icon: Search,
  },
  {
    title: "Offer",
    description:
      "Craft competitive terms — price, contingencies, escalation, and timelines — without overpaying blindly.",
    icon: HandCoins,
  },
  {
    title: "Inspection",
    description:
      "Coordinate inspectors, interpret reports, and negotiate repairs or credits with a clear risk frame.",
    icon: FileSearch,
  },
  {
    title: "Escrow",
    description:
      "Track disclosures, appraisal, title, and lender conditions so nothing stalls your closing date.",
    icon: Home,
  },
  {
    title: "Closing",
    description:
      "Final walkthrough, wire confirmation, and keys — with a post-close checklist for the first weeks.",
    icon: KeyRound,
  },
];

const firstTimeHighlights = [
  {
    title: "Budget that survives rate moves",
    body: "We model payments at today’s rate and a buffer — so you’re not stretched on day one.",
  },
  {
    title: "Contingencies, explained plainly",
    body: "Inspection, appraisal, and loan contingencies in plain English before you waive anything.",
  },
  {
    title: "Offer math, not FOMO",
    body: "Escalation clauses, seller credits, and rent-backs scored against comps — not vibes.",
  },
  {
    title: "HOA & disclosure triage",
    body: "What to skim, what to escalate, and when to walk away without regret.",
  },
];

const faqs = [
  {
    q: "How much do I need for a down payment in Silicon Valley?",
    a: "It depends on loan type and price point. Many buyers put 10–20% down on conventional loans; some first-time programs allow less. We’ll map scenarios with your lender before you shop.",
  },
  {
    q: "Should I waive contingencies to win?",
    a: "Sometimes strategically — never blindly. We’ll quantify inspection risk, appraisal gaps, and seller motivation so any waiver is intentional.",
  },
  {
    q: "How long does a typical purchase take?",
    a: "Search length varies; once under contract, 21–45 days is common depending on financing and complexity. Cash deals can close faster.",
  },
  {
    q: "Do you help with new construction and condos?",
    a: "Yes. Builder contracts, HOA docs, and parking/storage nuances get the same analytical attention as single-family homes.",
  },
];

export default function BuyPage() {
  const guideMailto = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
    "First-Time Buyer Guide PDF",
  )}&body=${encodeURIComponent(
    "Hi Jason — please send me the first-time buyer guide when available.",
  )}`;

  return (
    <>
      <PageHero
        eyebrow="Buy"
        title="Buy with clarity in a competitive market"
        description="A structured Silicon Valley buying process — consultation through closing — with market data and calm negotiation at every step."
        primaryCta={siteConfig.cta.consultation}
        secondaryCta={{ label: "Search homes", href: "/listings" }}
      />

      <Section
        eyebrow="The process"
        title="From first call to keys"
        description="Seven stages. Clear ownership. No mystery about what happens next."
      >
        <ol className="relative space-y-4 border-l border-border/80 pl-6 sm:pl-8">
          {timeline.map((step, index) => (
            <FadeIn key={step.title} delay={index * 0.04}>
              <li className="relative pb-2">
                <span className="absolute -left-[1.9rem] top-1 flex h-7 w-7 items-center justify-center rounded-full border border-accent/30 bg-background text-xs font-semibold text-accent sm:-left-[2.15rem]">
                  {index + 1}
                </span>
                <Card className="border-border/70">
                  <CardContent className="flex gap-4 p-5 sm:p-6">
                    <step.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <div className="space-y-1.5">
                      <h3 className="font-display text-xl font-semibold">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </li>
            </FadeIn>
          ))}
        </ol>
      </Section>

      <Section
        id="first-time"
        eyebrow="First-time buyers"
        title="A practical guide to your first purchase"
        description="The decisions that matter most — without the overwhelm."
        className="scroll-mt-24 bg-gradient-to-b from-slate-soft/80 to-background dark:from-card/30"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {firstTimeHighlights.map((item, index) => (
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

        <FadeIn delay={0.1} className="mt-10">
          <Card className="overflow-hidden border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
            <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  Free guide
                </p>
                <h3 className="font-display text-2xl font-semibold tracking-tight">
                  Download the first-time buyer guide
                </h3>
                <p className="max-w-xl text-sm text-muted-foreground">
                  PDF checklist covering pre-approval, offer strategy, and closing — email for
                  the latest version (placeholder until hosted file is live).
                </p>
              </div>
              <Button asChild size="lg" variant="accent">
                <a href={guideMailto}>
                  <Download className="h-4 w-4" />
                  Request guide
                </a>
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      </Section>

      <Section
        eyebrow="Tools"
        title="Run the numbers before you tour"
        description="Pair strategy with calculators so your search stays grounded."
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" variant="outline">
            <Link href="/mortgage-calculator">
              <Calculator className="h-4 w-4" />
              Mortgage calculator
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/tools/affordability">Affordability</Link>
          </Button>
          <Button asChild size="lg" variant="accent">
            <Link href={siteConfig.cta.consultation.href}>
              {siteConfig.cta.consultation.label}
            </Link>
          </Button>
        </div>
      </Section>

      <Section
        eyebrow="FAQ"
        title="Buying questions, answered"
        description="A few of the most common Silicon Valley buyer concerns."
      >
        <Accordion type="single" collapsible className="mx-auto max-w-3xl">
          {faqs.map((item, index) => (
            <AccordionItem key={item.q} value={`buy-faq-${index}`}>
              <AccordionTrigger className="text-base">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          More answers on the{" "}
          <Link href="/faq" className="font-medium text-accent hover:underline">
            full FAQ page
          </Link>
          .
        </p>
      </Section>

      <CtaBanner
        title="Ready to start your search?"
        description="Book a consultation or browse live listings — I'll help you turn interest into a winning offer."
        secondaryLabel={siteConfig.cta.search.label}
        secondaryHref={siteConfig.cta.search.href}
      />
    </>
  );
}
