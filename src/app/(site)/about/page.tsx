import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CtaBanner } from "@/components/shared/cta-banner";
import { FadeIn } from "@/components/shared/fade-in";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Jason Lim",
  description:
    "Bay Area native and South Bay homeowner. Compass REALTOR® helping buyers and sellers across San Jose and Silicon Valley with clear advice, local market knowledge, and responsive service.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Jason"
        title={
          <>
            Clear advice.
            <span className="block text-accent">Confident decisions.</span>
          </>
        }
        description="When it comes to buying or selling a home, choosing the right agent matters — someone who listens, knows the local market, and gives you the information you need."
        primaryCta={siteConfig.cta.consultation}
        secondaryCta={{ label: "Send a message", href: "/contact" }}
      />

      <Section className="pt-10 sm:pt-12">
        <div
          className={`grid items-start gap-12 lg:gap-16 ${
            siteConfig.showAgentPhotos ? "lg:grid-cols-[0.9fr_1.1fr]" : "max-w-3xl"
          }`}
        >
          {siteConfig.showAgentPhotos ? (
            <FadeIn>
              <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-border/80 bg-secondary shadow-lift lg:max-w-md">
                <Image
                  src={siteConfig.media.headshot}
                  alt={`${siteConfig.name} — professional headshot`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 90vw, 400px"
                  priority
                />
              </div>
            </FadeIn>
          ) : null}

          <FadeIn
            delay={siteConfig.showAgentPhotos ? 0.08 : 0}
            className="space-y-6"
          >
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
                You want an agent who listens, knows the local market, and gives you
                clear information — without pressure. As a Bay Area native and South
                Bay homeowner who has lived in Fremont, Berkeley, Milpitas, and San
                Jose, I bring firsthand familiarity with the neighborhoods, schools,
                and lifestyles across Silicon Valley.
              </p>
              <p className="leading-relaxed text-muted-foreground text-pretty">
                For buyers, I help you weigh comps, trends, disclosures, and financing
                so you know not just what a home costs, but whether it makes sense —
                then build a competitive offer strategy that protects your interests.
                For sellers, I focus on pricing, preparation, and marketing, with
                Compass tools and a trusted network of inspectors, contractors,
                stagers, and photographers.
              </p>
              <p className="leading-relaxed text-muted-foreground text-pretty">
                With {siteConfig.experience.techYears} years in software, enterprise
                technology, and AI, I bring an analytical mindset to every decision —
                data over guesswork, and straightforward advice whether you&apos;re
                buying, selling, moving up, or investing.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {siteConfig.credentials.map((credential) => (
                <Badge key={credential} variant="accent">
                  {credential}
                </Badge>
              ))}
            </div>

            <p className="text-sm font-medium text-foreground/80">
              {siteConfig.license.status} · {siteConfig.license.dre}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" variant="accent">
                <Link href={siteConfig.cta.consultation.href}>
                  Let&apos;s connect
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Contact me</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </Section>

      <Section
        id="why"
        eyebrow="Why?"
        title="Why I do this work"
        description="Real assets. Real neighborhoods. Real help — for as many Bay Area families as I can."
        className="scroll-mt-24"
      >
        <div className="mx-auto max-w-3xl space-y-5 text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
          <FadeIn>
            <p>
              Growing up in the Bay Area, I watched the real estate market move —
              and I watched purchasing power change as the dollar felt less certain
              over time. That made one idea stick: it is more important than ever to
              hold and buy{" "}
              <span className="font-medium text-foreground">real assets</span> —
              tangible property, not only digits on a screen like stocks or paper
              money.
            </p>
          </FadeIn>
          <FadeIn delay={0.04}>
            <p>
              At Berkeley I studied economics, started a personal finance club, and
              took coursework in real estate investments. I used an HP-12C financial
              calculator the old-school way — running cap rate and ROI analysis on
              investment properties in nearby Oakland — and brought investment
              advisors in to talk with students. That analytical habit never left.
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <p>
              I went into the hardware industry next. Later I realized I could help
              more people by putting those skills to work in real estate — where
              decisions are personal, high-stakes, and local. I stay competitive in
              this space because I know clients on the buy side, how the sell side
              thinks, the neighborhoods and history of Silicon Valley, and where
              trends may be headed next.
            </p>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p>
              I also dig into the details that change what you keep: how Proposition
              13 works, why relatives who bought in the 1980s might still pay roughly
              $1–2K a year in property tax on a home worth around $2M while newer
              homeowners can face $15–20K+, living trusts (revocable and
              irrevocable), tax planning, and rent-vs-buy analysis. On contracts, I
              take time to understand the Residential Purchase Agreement and related
              notices so we know when to negotiate, when to push forward, and when to
              walk away. When a situation gets complex — recovering earnest money when
              the contract allows, Notices to Perform, or a seller who is not closing —
              I coordinate with attorneys and other professionals to protect your
              position and keep the deal on track.
            </p>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p>
              Hands-on help matters too. My dad taught me handyman skills; in 2022 I
              ran my own landscaping company. I connect clients with strong
              contractors, custom furniture and staging partners, and I build
              websites and market with AI tools that can reduce seller-side costs.
              Day to day I stay current on jobs and tech, the economy, the political
              environment, and the international landscape — then translate that into
              practical guidance for buying or selling a Bay Area property. I am a
              San Jose homeowner myself, so I know what this market feels like from
              both sides of the table.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="font-medium text-foreground">
              Ultimately, I want to help as many people as I can make clearer,
              more confident real estate decisions.
            </p>
          </FadeIn>
          <FadeIn delay={0.24}>
            <p className="text-sm text-muted-foreground">
              Property tax, estate planning, and contract outcomes depend on your
              facts and timing. This is general information — not legal, tax, or
              accounting advice. For Prop 13, trusts, EMD disputes, and tax
              planning, we involve the right professionals when needed.
            </p>
          </FadeIn>
          <FadeIn delay={0.28}>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild variant="accent">
                <Link href={siteConfig.cta.consultation.href}>
                  Talk through your goals
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/sell#seller-toolkit">Seller toolkit</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </Section>

      <Section
        eyebrow="Background"
        title="At a glance"
        description={`${siteConfig.experience.techYears} years in software & hardware · Bay Area native · South Bay homeowner · Compass REALTOR®`}
        className="bg-slate-soft/50 dark:bg-card/30"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.stats.map((stat, index) => (
            <FadeIn key={stat.label} delay={index * 0.05}>
              <Card className="border-border/70">
                <CardContent className="space-y-1 p-6">
                  <p className="font-display text-3xl font-semibold tracking-tight text-accent">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Section>

      <CtaBanner
        title="Let's connect"
        description="Talk about how I can help you achieve your real estate goals — buying, selling, or investing in Silicon Valley."
      />
    </>
  );
}
