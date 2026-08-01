import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

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
    "Meet Jason Lim — Bay Area REALTOR® with 10+ years in software engineering and AI. Honest guidance for first-time buyers, move-up sellers, and investors across Silicon Valley.",
  path: "/about",
});

export default function AboutPage() {
  const { experience } = siteConfig;

  return (
    <>
      <PageHero
        eyebrow="About"
        title={
          <>
            Tech background.
            <span className="block text-accent">Fresh real estate perspective.</span>
          </>
        }
        description={`I'm ${siteConfig.name}（${siteConfig.nameZh}）— a licensed California REALTOR® who spent ${experience.techYears} years building enterprise software and AI tools before helping Bay Area families navigate one of life's biggest decisions.`}
        primaryCta={siteConfig.cta.consultation}
        secondaryCta={{ label: "Send a message", href: "/contact" }}
      />

      <Section className="pt-10 sm:pt-12">
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <FadeIn>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[1.75rem] border border-border/80 bg-secondary shadow-lift lg:max-w-none">
              <Image
                src={siteConfig.media.headshot}
                alt={`${siteConfig.name} — professional headshot`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 420px"
                priority
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.08} className="space-y-6">
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
                {siteConfig.description}
              </p>
              <p className="leading-relaxed text-muted-foreground text-pretty">
                I&apos;m newer to real estate than I am to technology — and I&apos;m
                transparent about that. What I bring is a disciplined, data-first
                approach honed in engineering: clear analysis, honest tradeoffs, and
                responsive communication when offers move fast in competitive Silicon
                Valley markets.
              </p>
              <p className="leading-relaxed text-muted-foreground text-pretty">
                My focus is {siteConfig.contact.address.region} — helping{" "}
                {siteConfig.audiences.join(", ").toLowerCase()} make confident
                decisions with modern tools, not outdated playbooks.
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
          </FadeIn>
        </div>
      </Section>

      <Section
        eyebrow="Background"
        title="From engineering to real estate"
        description={`${experience.techYears} years across ${experience.focus.join(", ").toLowerCase()} — now applied to comps, contracts, and negotiation.`}
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

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {experience.differentiators.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.04}>
              <Card className="h-full border-border/70">
                <CardContent className="space-y-2 p-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <div className="space-y-1">
                      <p className="font-display text-lg font-semibold">{item.title}</p>
                      <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Who I serve"
        title="Clients & strengths"
        description="Every engagement is tailored — whether you're buying your first condo or repositioning an investment portfolio."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <FadeIn>
            <Card className="h-full border-border/70">
              <CardContent className="space-y-4 p-6 sm:p-8">
                <h3 className="font-display text-xl font-semibold">Audiences</h3>
                <ul className="space-y-3">
                  {siteConfig.audiences.map((audience) => (
                    <li
                      key={audience}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      {audience}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.06}>
            <Card className="h-full border-border/70">
              <CardContent className="space-y-4 p-6 sm:p-8">
                <h3 className="font-display text-xl font-semibold">Core strengths</h3>
                <ul className="space-y-3">
                  {siteConfig.strengths.map((strength) => (
                    <li
                      key={strength}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        <FadeIn delay={0.1} className="mt-10">
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" variant="accent">
              <Link href={siteConfig.cta.consultation.href}>
                {siteConfig.cta.consultation.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Contact me</Link>
            </Button>
          </div>
        </FadeIn>
      </Section>

      <CtaBanner
        title="Let's talk about your next move"
        description="Schedule a consultation — I'll bring market data, comps, and a clear plan tailored to your timeline."
      />
    </>
  );
}
