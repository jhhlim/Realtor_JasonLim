import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/shared/fade-in";
import { BrandName } from "@/components/layout/brand-name";
import { GoalsInquiryForm } from "@/features/contact/goals-inquiry-form";

export function GoalsCta() {
  return (
    <Section
      id="goals"
      eyebrow="Let's connect"
      title="Local Knowledge. Thoughtful Guidance. Real Estate Decisions That Fit Your Life."
      description="Buying or selling a home is about more than market timing. Whether you're purchasing your first home, moving closer to family, relocating for work, or preparing for your next chapter, I provide personalized guidance backed by local market knowledge."
      className="scroll-mt-24"
    >
      <FadeIn>
        <p className="mb-8 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          As a REALTOR® with {siteConfig.brokerage.name} in Los Gatos, I help
          clients navigate the San Jose and greater Silicon Valley housing
          markets with confidence.{" "}
          <span className="font-medium text-foreground">
            {siteConfig.license.dre}
          </span>
        </p>
      </FadeIn>

      <FadeIn delay={0.04}>
        <div className="mb-8 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/blog">Explore Market Insights</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={siteConfig.cta.valuation.href}>
              Request a Home Valuation
            </Link>
          </Button>
          <Button asChild variant="accent">
            <Link href="/contact">Let&apos;s Connect</Link>
          </Button>
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        <Card className="overflow-hidden border-border/80 shadow-soft">
          <CardContent className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Let&apos;s talk about your real estate goals
              </p>
              <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Get personalized insights into your local housing market.
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Share what you&apos;re exploring and where you&apos;re looking —
                I&apos;ll follow up with neighborhood context and next steps.
              </p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  <BrandName /> · REALTOR® | {siteConfig.brokerage.name}
                </p>
                <p>{siteConfig.license.dre}</p>
                <p>
                  <a
                    href={siteConfig.contact.phoneHref}
                    className="hover:text-foreground"
                  >
                    {siteConfig.contact.phone}
                  </a>
                  {" · "}
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="hover:text-foreground"
                  >
                    {siteConfig.contact.email}
                  </a>
                </p>
              </div>
            </div>
            <GoalsInquiryForm />
          </CardContent>
        </Card>
      </FadeIn>
    </Section>
  );
}
