import Link from "next/link";
import { Mail, MessageSquare, Phone } from "lucide-react";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/shared/fade-in";
import { BrandName } from "@/components/layout/brand-name";

export function ContactCta() {
  return (
    <Section
      eyebrow="Let's talk"
      title="Schedule a consultation"
      description="Share your timeline and goals — I'll bring the market data, comps, and a clear next-step plan."
      align="center"
      className="pb-20 lg:pb-28"
    >
      <FadeIn>
        <Card className="mx-auto max-w-3xl overflow-hidden border-border/80 shadow-lift">
          <CardContent className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
            <div className="space-y-4 text-left">
              <p className="font-display text-2xl font-semibold tracking-tight">
                Prefer a direct line?
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a
                  href={siteConfig.contact.phoneHref}
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Phone className="h-4 w-4 text-accent" />
                  {siteConfig.contact.phone}
                </a>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Mail className="h-4 w-4 text-accent" />
                  {siteConfig.contact.email}
                </a>
                <a
                  href={siteConfig.contact.sms}
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <MessageSquare className="h-4 w-4 text-accent" />
                  Text <BrandName />
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Button asChild size="lg" variant="accent">
                <Link href={siteConfig.cta.consultation.href}>
                  {siteConfig.cta.consultation.label}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={siteConfig.cta.valuation.href}>
                  {siteConfig.cta.valuation.label}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </Section>
  );
}
