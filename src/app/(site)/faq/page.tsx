import Link from "next/link";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { CtaBanner } from "@/components/shared/cta-banner";

export const metadata = buildMetadata({
  title: "FAQ",
  description:
    "Frequently asked questions about buying, selling, process, and the tech-forward approach of Jason Lim Real Estate.",
  path: "/faq",
});

const faqGroups = [
  {
    id: "buying",
    title: "Buying",
    items: [
      {
        q: "Where do you primarily work?",
        a: `Silicon Valley and the South Bay — including San Jose, Milpitas, Fremont, Santa Clara, Sunnyvale, Cupertino, Los Gatos, Campbell, Mountain View, Palo Alto, and Morgan Hill.`,
      },
      {
        q: "Do I need to be pre-approved before touring?",
        a: "Strongly recommended in competitive pockets. Pre-approval clarifies budget and signals seriousness to sellers — especially in multiple-offer situations.",
      },
      {
        q: "How do you help first-time buyers?",
        a: "Plain-English education on contingencies, HOAs, and offer structure; lender intros; and a search plan that respects both budget and lifestyle goals.",
      },
      {
        q: "Can you help with investment properties?",
        a: "Yes — cash-flow screens, ADU potential, and rent vs. buy framing for investors who want numbers alongside neighborhood context.",
      },
    ],
  },
  {
    id: "selling",
    title: "Selling",
    items: [
      {
        q: "How do you price a home?",
        a: "With a CMA that weighs recent comps, active competition, condition, and school/lifestyle premiums — then a launch strategy for the first two weeks of demand.",
      },
      {
        q: "What marketing is included?",
        a: "Professional photography, MLS syndication, open houses, and targeted outreach. Video and staging recommendations are tailored to the property.",
      },
      {
        q: "How long will my home take to sell?",
        a: "It depends on price, condition, and micro-market. We’ll set expectations with current DOM and absorption for your neighborhood — not statewide averages.",
      },
      {
        q: "Should I make repairs before listing?",
        a: "Often a short list of high-ROI items beats a full remodel. You’ll get a prioritized punch list so spend maps to buyer perception.",
      },
    ],
  },
  {
    id: "process",
    title: "Process & communication",
    items: [
      {
        q: "How quickly do you respond?",
        a: "Typically within a few hours on business days — faster when offers or contingencies are time-sensitive. Text and email both work.",
      },
      {
        q: "What does a consultation include?",
        a: "Goals, timeline, budget/valuation framing, and a recommended next step — search plan, listing prep, or valuation deep-dive.",
      },
      {
        q: "Are you a newer agent?",
        a: `Yes — and I'm transparent about it. ${siteConfig.experience.techYears} years in software, AI, and analytics mean you get current market focus, modern tools, and no outdated playbook.`,
      },
      {
        q: "Do you charge buyers a fee?",
        a: "Buyer representation compensation varies by listing and agreement. We’ll review options clearly before you tour seriously.",
      },
    ],
  },
  {
    id: "tech",
    title: "Tech approach",
    items: [
      {
        q: "What does “AI-powered” actually mean here?",
        a: "Practical tools: clearer comps, scenario modeling, and faster research synthesis — always reviewed by a human who knows the local market.",
      },
      {
        q: "Will I get dashboards and data dumps?",
        a: "You’ll get decision-ready summaries — what matters for your offer or list price — not a wall of charts for chart’s sake.",
      },
      {
        q: "How do you stay current on the market?",
        a: "Weekly tracking of inventory, pricing, and rate dynamics across core South Bay cities, plus on-the-ground feedback from showings.",
      },
      {
        q: "Is my data private?",
        a: "Contact and inquiry data is used to serve your real estate needs. See the Privacy Policy for details, and ask anytime about how information is handled.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Answers before you need them"
        description="Buying, selling, process, and how technology fits into a Bay Area transaction."
        primaryCta={siteConfig.cta.consultation}
        secondaryCta={{ label: "Contact", href: "/contact" }}
      />

      {faqGroups.map((group) => (
        <Section
          key={group.id}
          id={group.id}
          eyebrow={group.title}
          title={group.title}
          description={
            group.id === "buying"
              ? "Common questions from Silicon Valley home shoppers."
              : group.id === "selling"
                ? "What sellers ask before listing."
                : group.id === "process"
                  ? "How we work together day to day."
                  : "Where software and AI show up in your deal."
          }
          className={
            group.id === "selling" || group.id === "tech"
              ? "bg-gradient-to-b from-slate-soft/70 to-background dark:from-card/30"
              : undefined
          }
        >
          <Accordion type="single" collapsible className="mx-auto max-w-3xl">
            {group.items.map((item, index) => (
              <AccordionItem key={item.q} value={`${group.id}-${index}`}>
                <AccordionTrigger className="text-base">{item.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Section>
      ))}

      <Section align="center" title="Still have a question?">
        <p className="mx-auto max-w-xl text-muted-foreground">
          Reach out anytime — or browse{" "}
          <Link href="/resources" className="font-medium text-accent hover:underline">
            resources
          </Link>{" "}
          for guides and market reports.
        </p>
      </Section>

      <CtaBanner />
    </>
  );
}
