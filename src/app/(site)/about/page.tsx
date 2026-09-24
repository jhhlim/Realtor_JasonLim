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
                When it comes to buying or selling a home, choosing the right agent
                matters. You want someone who listens to your needs, understands the
                local market, and gives you the information you need to make a
                confident decision — without pushing you into something that
                isn&apos;t right for you.
              </p>
              <p className="leading-relaxed text-muted-foreground text-pretty">
                As a Bay Area native and a South Bay homeowner myself, I understand
                the home-buying experience not only as a REALTOR®, but also from the
                perspective of someone who has personally navigated this market.
                Having lived throughout Fremont, Berkeley, Milpitas, and San Jose, I
                bring firsthand familiarity with the neighborhoods, commutes,
                schools, and lifestyles that shape real estate decisions across San
                Jose and Silicon Valley.
              </p>
              <p className="leading-relaxed text-muted-foreground text-pretty">
                For buyers, my goal is to help you understand not just what a home
                costs, but whether it makes sense for you. I use comparable sales,
                market trends, property disclosures, financing considerations, and
                neighborhood data to help you evaluate each opportunity. When
                it&apos;s time to make an offer, I&apos;ll help you develop a
                competitive strategy while protecting your interests and keeping as
                much money in your pocket as possible.
              </p>
              <p className="leading-relaxed text-muted-foreground text-pretty">
                For sellers, I take a strategic approach to pricing, preparation, and
                marketing to position your property for maximum exposure and the
                strongest possible result. Through Compass, I also have access to
                powerful marketing tools and a network of trusted professionals —
                including inspectors, contractors, handymen, stagers, and
                photographers — who can help prepare your property for market.
              </p>
              <p className="leading-relaxed text-muted-foreground text-pretty">
                Before real estate, I spent more than 10 years working in software
                engineering, enterprise technology, and AI. I bring that same
                analytical mindset to real estate — using data and modern technology
                to help my clients understand their options rather than relying on
                guesswork.
              </p>
              <p className="leading-relaxed text-muted-foreground text-pretty">
                Whether you&apos;re buying your first home, selling, moving up, or
                evaluating an investment property, my goal is simple: provide
                straightforward advice, responsive service, and the information you
                need to make a decision that is right for you.
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
