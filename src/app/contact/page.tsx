import Link from "next/link";
import {
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/shared/fade-in";
import { CtaBanner } from "@/components/shared/cta-banner";
import { ContactForm } from "@/features/contact/contact-form";
import { NewsletterForm } from "@/features/newsletter/newsletter-form";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Schedule a consultation, send a message, or subscribe to Bay Area market updates from Jason Lim.",
  path: "/contact",
});

const socialLinks = [
  { label: "Instagram", href: siteConfig.social.instagram },
  { label: "LinkedIn", href: siteConfig.social.linkedin },
  { label: "Facebook", href: siteConfig.social.facebook },
  { label: "YouTube", href: siteConfig.social.youtube },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your next move"
        description="Share your timeline and goals — or book time directly. Phone, email, and SMS are always available."
        primaryCta={{ label: "Jump to schedule", href: "#schedule" }}
        secondaryCta={{ label: "Market newsletter", href: "#newsletter" }}
      />

      <Section
        eyebrow="Message"
        title="Send a note"
        description="I typically respond within a few hours during business days."
      >
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <FadeIn>
            <Card className="border-border/70 shadow-soft">
              <CardContent className="p-6 sm:p-8">
                <ContactForm />
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="space-y-6">
              <Card className="border-border/70">
                <CardContent className="space-y-4 p-6">
                  <h3 className="font-display text-xl font-semibold">Direct lines</h3>
                  <div className="space-y-3 text-sm">
                    <a
                      href={siteConfig.contact.phoneHref}
                      className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Phone className="h-4 w-4 text-accent" />
                      {siteConfig.contact.phone}
                    </a>
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Mail className="h-4 w-4 text-accent" />
                      {siteConfig.contact.email}
                    </a>
                    <a
                      href={siteConfig.contact.sms}
                      className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <MessageSquare className="h-4 w-4 text-accent" />
                      Text / SMS
                    </a>
                    <p className="flex items-start gap-3 text-muted-foreground">
                      <MapPin className="mt-0.5 h-4 w-4 text-accent" />
                      <span>
                        {siteConfig.contact.address.line1}
                        <br />
                        {siteConfig.contact.address.city},{" "}
                        {siteConfig.contact.address.state}{" "}
                        {siteConfig.contact.address.zip}
                        <br />
                        {siteConfig.contact.address.region}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/70">
                <CardContent className="space-y-4 p-6">
                  <h3 className="font-display text-xl font-semibold">Social</h3>
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.map((item) => (
                      <Button key={item.label} asChild variant="outline" size="sm">
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={item.label}
                        >
                          {item.label}
                        </a>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dashed border-border/80 bg-slate-soft/50 dark:bg-card/40">
                <CardContent className="space-y-3 p-6">
                  <h3 className="font-display text-xl font-semibold">
                    Google Business
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Map embed and GBP profile placeholder — connect your verified listing when
                    ready.
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={siteConfig.social.googleBusiness}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Google Business profile
                    </a>
                  </Button>
                  <div
                    className="flex aspect-video items-center justify-center rounded-2xl border border-border/60 bg-background text-center text-sm text-muted-foreground"
                    role="img"
                    aria-label="Google Business map placeholder"
                  >
                    Map / Google Business embed placeholder
                  </div>
                </CardContent>
              </Card>
            </div>
          </FadeIn>
        </div>
      </Section>

      <Section
        id="schedule"
        eyebrow="Schedule"
        title="Book a consultation"
        description="Pick a time that works — or use the link if the embed is blocked."
        className="bg-gradient-to-b from-slate-soft/80 to-background dark:from-card/30 scroll-mt-24"
      >
        <FadeIn>
          <Card className="overflow-hidden border-border/70">
            <CardContent className="space-y-4 p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  Powered by Calendly (replace URL via{" "}
                  <code className="text-xs">NEXT_PUBLIC_CALENDLY_URL</code>).
                </p>
                <Button asChild variant="outline" size="sm">
                  <a
                    href={siteConfig.calendly}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Calendly
                  </a>
                </Button>
              </div>
              <iframe
                title="Schedule a consultation with Jason Lim"
                src={siteConfig.calendly}
                className="h-[700px] w-full rounded-2xl border border-border/60 bg-background"
                loading="lazy"
              />
            </CardContent>
          </Card>
        </FadeIn>
      </Section>

      <Section
        id="newsletter"
        eyebrow="Newsletter"
        title="Bay Area market updates"
        description="Occasional notes on inventory, rates, and neighborhood trends — no spam."
        className="scroll-mt-24"
      >
        <FadeIn>
          <Card className="mx-auto max-w-3xl border-border/70 shadow-soft">
            <CardContent className="p-6 sm:p-8">
              <NewsletterForm />
            </CardContent>
          </Card>
        </FadeIn>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Prefer browsing first?{" "}
          <Link href="/market-reports" className="font-medium text-accent hover:underline">
            Read the latest market reports
          </Link>
          .
        </p>
      </Section>

      <CtaBanner
        title="Prefer to explore homes first?"
        description="Search listings or request a valuation — then we can dig into strategy together."
        secondaryLabel={siteConfig.cta.search.label}
        secondaryHref={siteConfig.cta.search.href}
      />
    </>
  );
}
