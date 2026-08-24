import Link from "next/link";
import { ExternalLink, Play, Star } from "lucide-react";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import {
  mockReviewAggregates,
  mockTestimonials,
} from "@/data/mock-testimonials";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/shared/fade-in";
import { CtaBanner } from "@/components/shared/cta-banner";

export const metadata = buildMetadata({
  title: "Testimonials",
  description:
    "Client stories from Bay Area buyers and sellers who worked with Jason Lim — plus Google, Zillow, and Yelp review placeholders.",
  path: "/testimonials",
});

function sourceLabel(source?: string) {
  if (!source || source === "direct") return "Client";
  return source.charAt(0).toUpperCase() + source.slice(1);
}

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="Outcomes clients remember"
        description="Real feedback from buyers and sellers across Silicon Valley — calm process, clear data, and responsive communication."
        primaryCta={siteConfig.cta.consultation}
        secondaryCta={{ label: "About Jason", href: "/about" }}
      />

      <Section
        eyebrow="Reviews"
        title="Aggregate ratings (placeholders)"
        description="Connect live Google, Zillow, and Yelp feeds when profiles are verified — numbers below are demo placeholders."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mockReviewAggregates.map((agg, index) => (
            <FadeIn key={agg.source} delay={index * 0.05}>
              <Card className="h-full border-border/70">
                <CardContent className="space-y-3 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {sourceLabel(agg.source)}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-3xl font-semibold">
                      {agg.rating.toFixed(1)}
                    </span>
                    <Star className="h-4 w-4 fill-accent text-accent" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {agg.count} reviews
                  </p>
                  {agg.url ? (
                    <Button asChild variant="link" className="h-auto p-0">
                      <a href={agg.url} target="_blank" rel="noopener noreferrer">
                        View on {sourceLabel(agg.source)}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Prefer leaving a review?{" "}
          <a
            href={siteConfig.googleReviewsUrl}
            className="font-medium text-accent hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google reviews
          </a>
          .
        </p>
      </Section>

      <Section
        eyebrow="Client stories"
        title="What working together felt like"
        description="Quotes from mock testimonials — replace with verified reviews as they come in."
        className="bg-gradient-to-b from-slate-soft/80 to-background dark:from-card/30"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {mockTestimonials.map((t, index) => (
            <FadeIn key={t.id} delay={index * 0.04}>
              <Card className="flex h-full flex-col border-border/70 shadow-soft">
                <CardContent className="flex flex-1 flex-col gap-5 p-6 sm:p-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-accent text-accent"
                        />
                      ))}
                    </div>
                    <Badge variant="secondary">{sourceLabel(t.source)}</Badge>
                    <Badge variant="outline">{t.role}</Badge>
                  </div>
                  <blockquote className="flex-1 font-display text-lg font-medium leading-snug tracking-tight text-balance sm:text-xl">
                    “{t.quote}”
                  </blockquote>
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.location}</p>
                  </div>
                  {t.videoUrl ? (
                    <div className="space-y-3 rounded-2xl border border-dashed border-border/80 bg-slate-soft/60 p-4 dark:bg-secondary/20">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                        Video testimonial
                      </p>
                      <div
                        className="flex aspect-video items-center justify-center rounded-xl bg-background text-sm text-muted-foreground"
                        role="img"
                        aria-label={`Video testimonial placeholder for ${t.name}`}
                      >
                        <span className="inline-flex items-center gap-2">
                          <Play className="h-4 w-4 text-accent" />
                          Video placeholder
                        </span>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={t.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open video link
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section align="center">
        <p className="text-sm text-muted-foreground">
          Want to share your experience?{" "}
          <Link href="/contact" className="font-medium text-accent hover:underline">
            Contact Jason
          </Link>{" "}
          or leave a review on Google.
        </p>
      </Section>

      <CtaBanner
        title="Ready for your own success story?"
        description="Schedule a consultation and we'll map a clear plan for your buy or sell."
      />
    </>
  );
}
