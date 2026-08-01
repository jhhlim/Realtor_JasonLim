import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Calculator,
  FileBarChart,
  HelpCircle,
  Home,
  LineChart,
  Newspaper,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/shared/fade-in";
import { CtaBanner } from "@/components/shared/cta-banner";

export const metadata = buildMetadata({
  title: "Resources",
  description:
    "Bay Area real estate resources — calculators, market reports, guides, blog, and FAQ from Jason Lim.",
  path: "/resources",
});

const hubs = [
  {
    title: "Tools",
    description: "Mortgage, affordability, valuation, rent vs buy, and investment calculators.",
    icon: Calculator,
    links: [
      { label: "Mortgage calculator", href: "/mortgage-calculator" },
      { label: "Home valuation", href: "/tools/home-valuation" },
      { label: "Affordability", href: "/tools/affordability" },
      { label: "Rent vs buy", href: "/tools/rent-vs-buy" },
      { label: "Investment calculator", href: "/tools/investment" },
    ],
  },
  {
    title: "Market reports",
    description: "Silicon Valley snapshots on pricing, inventory, and neighborhood trends.",
    icon: FileBarChart,
    links: [
      { label: "All market reports", href: "/market-reports" },
      { label: "Latest Q2 2026 report", href: "/market-reports/silicon-valley-q2-2026" },
    ],
  },
  {
    title: "Guides",
    description: "Practical walkthroughs for buying and selling in a competitive market.",
    icon: BookOpen,
    links: [
      { label: "Buyer process", href: "/buy" },
      { label: "Seller process", href: "/sell" },
      { label: "First-time buyer notes", href: "/buy#first-time" },
      { label: "Request buyer guide PDF", href: `mailto:${siteConfig.contact.email}?subject=Buyer%20Guide` },
    ],
  },
  {
    title: "Blog & learning",
    description: "Articles on buying, selling, mortgages, and Bay Area market dynamics.",
    icon: Newspaper,
    links: [
      { label: "Insights", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "Communities", href: "/communities" },
    ],
  },
];

const quickLinks = [
  { label: "Search homes", href: "/listings", icon: Home },
  { label: "Market reports", href: "/market-reports", icon: LineChart },
  { label: "FAQ", href: "/faq", icon: HelpCircle },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Tools and guides for clearer decisions"
        description="Calculators, market reports, buying and selling guides, and answers — all in one place."
        primaryCta={siteConfig.cta.consultation}
        secondaryCta={siteConfig.cta.marketReport}
      />

      <Section
        eyebrow="Quick links"
        title="Start here"
        description="Jump to the most-used destinations."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {quickLinks.map((item, index) => (
            <FadeIn key={item.href} delay={index * 0.05}>
              <Link
                href={item.href}
                className="group flex items-center justify-between rounded-2xl border border-border/70 bg-card px-5 py-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-accent/40"
              >
                <span className="inline-flex items-center gap-3 font-medium">
                  <item.icon className="h-5 w-5 text-accent" />
                  {item.label}
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-accent" />
              </Link>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Library"
        title="Browse by category"
        description="Everything linked from the footer tools and company sections — organized for buyers and sellers."
        className="bg-gradient-to-b from-slate-soft/80 to-background dark:from-card/30"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {hubs.map((hub, index) => (
            <FadeIn key={hub.title} delay={index * 0.05}>
              <Card className="h-full border-border/70">
                <CardContent className="space-y-5 p-6 sm:p-7">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <hub.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold">{hub.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{hub.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {hub.links.map((link) => (
                      <li key={link.href + link.label}>
                        <Link
                          href={link.href}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent"
                        >
                          {link.label}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Section>

      <CtaBanner
        title="Need a guided walkthrough?"
        description="Resources help — a consultation turns them into a personal plan."
      />
    </>
  );
}
