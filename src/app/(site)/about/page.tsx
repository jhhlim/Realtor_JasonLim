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
                  className="object-cover"
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
